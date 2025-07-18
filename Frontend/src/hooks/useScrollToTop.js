import { useState, useEffect, useCallback } from 'react'

const useScrollToTop = (threshold = 300) => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const updateScrollState = useCallback(() => {
    const scrollTop = window.pageYOffset
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    
    // Calculate scroll progress (0 to 100)
    const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
    setScrollProgress(Math.min(progress, 100))
    
    // Show/hide button based on threshold
    setIsVisible(scrollTop > threshold)
  }, [threshold])

  useEffect(() => {
    // Initial check
    updateScrollState()

    // Throttled scroll handler for better performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollToTop = useCallback((smooth = true) => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  const scrollToPosition = useCallback((position, smooth = true) => {
    if (smooth) {
      window.scrollTo({
        top: position,
        left: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, position)
    }
  }, [])

  return {
    isVisible,
    scrollProgress,
    scrollToTop,
    scrollToPosition
  }
}

export default useScrollToTop
