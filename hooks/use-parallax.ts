"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface ParallaxOptions {
  speed?: number        // multiplier for scroll offset (0.1 = subtle, 0.5 = strong)
  direction?: "up" | "down"
  clamp?: [number, number] // min/max translateY in px
}

export function useParallax({ speed = 0.3, direction = "up", clamp }: ParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight
    // How far the element center is from viewport center, normalized
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = windowH / 2
    const distance = elementCenter - viewportCenter
    let raw = distance * speed * (direction === "up" ? 1 : -1)

    if (clamp) {
      raw = Math.max(clamp[0], Math.min(clamp[1], raw))
    }

    setOffset(raw)
    ticking.current = false
  }, [speed, direction, clamp])

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    update() // initial position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [update])

  return { ref, offset }
}

/**
 * Returns a 0-1 progress value based on how far through the viewport the element has scrolled.
 * 0 = element just entering bottom, 1 = element leaving top.
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight
    // When top is at bottom of viewport = 0, when bottom is at top of viewport = 1
    const total = windowH + rect.height
    const current = windowH - rect.top
    const p = Math.max(0, Math.min(1, current / total))
    setProgress(p)
    ticking.current = false
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    update()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [update])

  return { ref, progress }
}
