"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

/**
 * Observe multiple children inside a container and stagger their reveal.
 * Returns a ref to attach to the parent and a function to get child className.
 */
export function useStaggerReveal(
  animationType: "up" | "left" | "right" | "scale" | "rotate" = "up",
  staggerDelay = 200,
  threshold = 0.1
) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const getChildProps = useCallback(
    (index: number) => ({
      className: `reveal-${animationType} ${isVisible ? "is-visible" : ""}`,
      style: isVisible ? { animationDelay: `${index * staggerDelay}ms` } : undefined,
    }),
    [isVisible, animationType, staggerDelay]
  )

  return { ref, isVisible, getChildProps }
}
