'use client'

import React, { Component, ReactNode, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-cyan-400/20 border border-blue-400/30 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(56,209,255,0.2)]" />
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
  const [isInView, setIsInView] = useState(false)
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check hardware & motion preference
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // On touch devices or reduced motion preference, keep clean fallback placeholder
    if (!finePointer || reducedMotion) {
      setShouldRenderSpline(false)
      return
    }

    setShouldRenderSpline(true)

    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { rootMargin: '150px 0px 150px 0px', threshold: 0.01 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Catch unhandled Promise rejections from @splinetool/runtime
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        (String(event.reason).includes('Failed to fetch') ||
          String(event.reason).includes('splinetool') ||
          String(event.reason).includes('spline'))
      ) {
        event.preventDefault()
        setHasError(true)
      }
    }

    window.addEventListener('unhandledrejection', handleRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const fallbackVisual = (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-purple-600/30 border border-cyan-400/30 animate-pulse shadow-[0_0_50px_rgba(56,209,255,0.25)] flex items-center justify-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-cyan-400/20 blur-xl animate-ping" />
        </div>
      </div>
    </div>
  )

  if (hasError || !shouldRenderSpline) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        {fallbackVisual}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {isInView ? (
        <SplineErrorBoundary fallback={fallbackVisual}>
          <Spline
            scene={scene}
            className={className}
            onError={() => setHasError(true)}
          />
        </SplineErrorBoundary>
      ) : (
        fallbackVisual
      )}
    </div>
  )
}

