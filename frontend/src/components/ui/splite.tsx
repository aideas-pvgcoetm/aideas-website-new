'use client'

import React, { Component, ReactNode, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(
  async () => {
    const [mod, runtime] = await Promise.all([
      import('@splinetool/react-spline'),
      import('@splinetool/runtime'),
    ])
    const App = runtime.Application
    if (App && !(App.prototype as any).__watermarkPatched) {
      ;(App.prototype as any).__watermarkPatched = true

      const origCreateRenderer = (App.prototype as any)._createRenderer
      if (origCreateRenderer) {
        ;(App.prototype as any)._createRenderer = async function (...args: any[]) {
          const rend = await origCreateRenderer.apply(this, args)
          if (rend?.pipeline) {
            rend.pipeline.setWatermark = () => {}
            if (rend.pipeline.logoOverlayPass) {
              rend.pipeline.logoOverlayPass.enabled = false
            }
            if ('watermarkTexture' in rend.pipeline) {
              rend.pipeline.watermarkTexture = null
            }
          }
          return rend
        }
      }

      const origStart = (App.prototype as any).start
      if (origStart) {
        ;(App.prototype as any).start = async function (...args: any[]) {
          const res = await origStart.apply(this, args)
          try {
            if (this._renderer?.pipeline) {
              this._renderer.pipeline.setWatermark = () => {}
              if (this._renderer.pipeline.logoOverlayPass) {
                this._renderer.pipeline.logoOverlayPass.enabled = false
              }
              if ('watermarkTexture' in this._renderer.pipeline) {
                this._renderer.pipeline.watermarkTexture = null
              }
            }
            if (typeof this.requestRender === 'function') {
              this.requestRender()
            }
          } catch (e) {}
          return res
        }
      }
    }
    return mod
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)

interface SplineSceneProps {
  scene: string
  className?: string
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('Spline 3D scene error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-cyan-400/30 border border-blue-400/40 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(56,209,255,0.25)]">
                <div className="w-14 h-14 rounded-full bg-blue-500/30 blur-md" />
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Interactive 3D Visual</span>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const [isHidden, setIsHidden] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isInView) {
      setIsHidden(false)
    } else {
      const timer = setTimeout(() => {
        setIsHidden(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Auto-remove Spline watermark logo without needing any overflow clipping
  useEffect(() => {
    const removeWatermark = () => {
      const el =
        document.getElementById('spline-watermark') ||
        document.querySelector('a[href*="spline.design"]') ||
        containerRef.current?.querySelector('a[href*="spline"]')
      if (el) {
        ;(el as HTMLElement).style.setProperty('display', 'none', 'important')
        el.remove()
      }
    }

    removeWatermark()
    const timer = setInterval(removeWatermark, 100)
    const observer = new MutationObserver(removeWatermark)
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true })
    }
    observer.observe(document.body, { childList: true, subtree: true })

    const timeout = setTimeout(() => {
      clearInterval(timer)
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // Catch unhandled Promise rejections from @splinetool/runtime
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        (String(event.reason).includes('Failed to fetch') ||
          String(event.reason).includes('splinetool') ||
          String(event.reason).includes('spline'))
      ) {
        event.preventDefault()
        if (isMounted) setHasError(true)
      }
    }

    window.addEventListener('unhandledrejection', handleRejection)

    // Pre-verify scene URL availability
    fetch(scene, { method: 'HEAD', mode: 'cors' })
      .then((res) => {
        if (!isMounted) return
        if (res.ok || res.status === 0) {
          setIsReady(true)
        } else {
          setHasError(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          fetch(scene, { mode: 'cors' })
            .then(() => { if (isMounted) setIsReady(true) })
            .catch(() => { if (isMounted) setHasError(true) })
        }
      })

    return () => {
      isMounted = false
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [scene])

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-cyan-400/30 border border-blue-400/40 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(56,209,255,0.25)]">
            <div className="w-14 h-14 rounded-full bg-blue-500/30 blur-md" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 tracking-wider">AI 3D Scene</span>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div 
        className={`w-full h-full transition-opacity duration-500 ${isInView ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ visibility: isHidden ? 'hidden' : 'visible' }}
        aria-hidden={!isInView}
      >
        <SplineErrorBoundary>
          <Spline
            scene={scene}
            className={className}
            onError={() => setHasError(true)}
            onLoad={(splineApp: any) => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('spline-loaded'));
              }

              const killWatermark = () => {
                try {
                  const pipeline = splineApp?._renderer?.pipeline;
                  if (pipeline) {
                    if (typeof pipeline.setWatermark === 'function') {
                      pipeline.setWatermark(null);
                      pipeline.setWatermark = () => {};
                    }
                    if (pipeline.logoOverlayPass) {
                      pipeline.logoOverlayPass.enabled = false;
                    }
                    if ('watermarkTexture' in pipeline) {
                      pipeline.watermarkTexture = null;
                    }
                    if (typeof splineApp.requestRender === 'function') {
                      splineApp.requestRender();
                    }
                  }
                } catch (e) {
                  console.warn('Spline watermark suppression:', e);
                }
              };

              killWatermark();
              requestAnimationFrame(killWatermark);
              setTimeout(killWatermark, 50);
              setTimeout(killWatermark, 150);
              setTimeout(killWatermark, 400);
              setTimeout(killWatermark, 1000);
            }}
          />
        </SplineErrorBoundary>
      </div>
    </div>
  )
}
