import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Form state kept in the URL query string so every result is shareable.
 * The live state is local (so typing is never dropped while the URL update is
 * still in flight); it is initialised from the URL and mirrored back to it.
 * Values equal to their default (or empty) are dropped from the URL.
 */
export function useQueryState<T extends Record<string, string>>(defaults: T) {
  const [params, setParams] = useSearchParams()
  const defaultsRef = useRef(defaults)

  const [values, setValues] = useState<T>(() => {
    const out = { ...defaults }
    for (const key of Object.keys(defaults)) {
      const v = params.get(key)
      if (v !== null) (out as Record<string, string>)[key] = v
    }
    return out
  })

  const set = useCallback(
    (patch: Partial<T>) => {
      setValues((prev) => ({ ...prev, ...patch }))
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [k, v] of Object.entries(patch)) {
            if (v === undefined || v === '' || v === defaultsRef.current[k]) next.delete(k)
            else next.set(k, v as string)
          }
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => {
    setValues({ ...defaultsRef.current })
    setParams({}, { replace: true })
  }, [setParams])

  const touched = Object.keys(defaultsRef.current).some((k) => values[k] !== defaultsRef.current[k])

  return { values, set, reset, touched }
}
