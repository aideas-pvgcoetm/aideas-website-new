'use client'

import React, { Component, ReactNode, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

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

    return () => {
      isMounted = false
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

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

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div 
        className={`w-full h-full transition-opacity duration-500 ${isInView ? 'opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ visibility: isHidden ? 'hidden' : 'visible' }}
        aria-hidden={!isInView}
      >
        <SplineErrorBoundary>
          <Spline
            scene={scene}
            className={className}
            onError={() => setHasError(true)}
            onLoad={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('spline-loaded'));
              }
            }}
          />
        </SplineErrorBoundary>
      </div>
    </div>
  )
}
