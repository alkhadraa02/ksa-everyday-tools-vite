import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Form state kept in the URL query string so every result is shareable.
 * Values equal to their default (or empty) are dropped from the URL.
 */
export function useQueryState<T extends Record<string, string>>(defaults: T) {
  const [params, setParams] = useSearchParams()

  const values = useMemo(() => {
    const out = { ...defaults }
    for (const key of Object.keys(defaults)) {
      const v = params.get(key)
      if (v !== null) (out as Record<string, string>)[key] = v
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const set = useCallback(
    (patch: Partial<T>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [k, v] of Object.entries(patch)) {
            if (v === undefined || v === '' || v === defaults[k]) next.delete(k)
            else next.set(k, v as string)
          }
          return next
        },
        { replace: true },
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setParams],
  )

  const reset = useCallback(() => setParams({}, { replace: true }), [setParams])
  const touched = useMemo(() => Object.keys(defaults).some((k) => params.has(k)), [params]) // eslint-disable-line react-hooks/exhaustive-deps

  return { values, set, reset, touched }
}
