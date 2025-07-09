import { useEffect, useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'

interface UseAutoResizeOptions {
  minHeight?: number
  maxHeight?: number
  debounceMs?: number
}

export const useAutoResize = (
  value: string,
  options: UseAutoResizeOptions = {}
) => {
  const { minHeight = 40, maxHeight = 200, debounceMs = 50 } = options
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
    
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.overflowY = 'hidden'
    }
  }, [minHeight, maxHeight])

  const debouncedAdjustHeight = useRef(
    debounce(adjustHeight, debounceMs)
  ).current

  useEffect(() => {
    debouncedAdjustHeight()
    
    return () => {
      debouncedAdjustHeight.cancel()
    }
  }, [value, debouncedAdjustHeight])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleResize = () => {
      adjustHeight()
    }

    window.addEventListener('resize', handleResize)
    
    adjustHeight()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [adjustHeight])

  return textareaRef
}