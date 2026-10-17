import { useEffect, useId, type ReactNode } from 'react'

export const SITE_NAME = 'أدوات يومية'

/** Per-route document title + meta description (client-side SPA). */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title === SITE_NAME ? `${SITE_NAME} — حاسبات سعودية مجانية` : `${title} — ${SITE_NAME}`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  type?: 'text' | 'date'
  inputMode?: 'decimal' | 'numeric' | 'text'
  placeholder?: string
  suffix?: string
  error?: string | null
}

export function Field({ label, value, onChange, hint, type = 'text', inputMode = 'decimal', placeholder, error }: FieldProps) {
  const id = useId()
  const hid = `${id}-h`
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        inputMode={type === 'date' ? undefined : inputMode}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? hid : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {(hint || error) && (
        <span id={hid} className={error ? 'hint error-text' : 'hint'}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}

interface SegProps<T extends string> {
  legend: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}

export function Seg<T extends string>({ legend, value, options, onChange }: SegProps<T>) {
  const name = useId()
  return (
    <fieldset className="field" style={{ border: 0, padding: 0, margin: 0, minInlineSize: 0 }}>
      <legend className="legend" style={{ padding: 0 }}>
        {legend}
      </legend>
      <div className="seg">
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Line({ label, value, total }: { label: string; value: ReactNode; total?: boolean }) {
  return (
    <div className={total ? 'line total' : 'line'}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function ToolShell({
  title,
  lead,
  children,
  explain,
}: {
  title: string
  lead: string
  children: ReactNode
  explain: ReactNode
}) {
  return (
    <>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      {children}
      <section className="panel explain" aria-labelledby="explain-h" style={{ marginBlockStart: '1.25rem' }}>
        <h2 id="explain-h">كيف يعمل الحساب؟</h2>
        {explain}
      </section>
    </>
  )
}

/** Copies the current URL so a result can be shared. */
export function ShareButton() {
  const id = useId()
  return (
    <button
      type="button"
      className="btn secondary"
      aria-describedby={id}
      onClick={async (e) => {
        const btn = e.currentTarget
        try {
          await navigator.clipboard.writeText(window.location.href)
          btn.textContent = 'تم نسخ الرابط ✓'
        } catch {
          btn.textContent = 'انسخ الرابط من شريط العنوان'
        }
        setTimeout(() => (btn.textContent = 'نسخ رابط النتيجة'), 2200)
      }}
    >
      نسخ رابط النتيجة
      <span id={id} className="visually-hidden">
        ينسخ رابطًا يحمل المدخلات الحالية
      </span>
    </button>
  )
}
