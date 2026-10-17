import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { parseNum } from '../lib/format'
import { integerToWords, MAX_WORDS_INTEGER, sarToWords } from '../lib/words'
import { useQueryState } from '../lib/useQueryState'

export default function NumberToWords() {
  useSeo('تفقيط الأرقام بالعربية', 'حوّل الأرقام والمبالغ بالريال السعودي إلى كلمات عربية صحيحة جاهزة للشيكات والعقود.')
  const { values: v, set, reset, touched } = useQueryState({ n: '', mode: 'sar' })
  const mode = v.mode === 'plain' ? 'plain' : 'sar'
  const n = parseNum(v.n)
  let text: string | null = null
  let detail: string | null = null
  let error: string | null = null

  if (v.n.trim() !== '') {
    if (n === null || n < 0) error = 'أدخل رقمًا صحيحًا غير سالب'
    else if (mode === 'sar') {
      const r = sarToWords(n)
      if (!r) error = 'المبلغ كبير جدًا'
      else {
        text = r.text
        detail = `${r.riyals} ريال و${r.halalas} هللة`
      }
    } else if (!Number.isInteger(n)) error = 'في وضع الرقم المجرد أدخل عددًا صحيحًا بلا كسور'
    else {
      text = integerToWords(n)
      if (!text) error = `الحد الأعلى ${MAX_WORDS_INTEGER.toLocaleString('en')}`
    }
  }

  return (
    <ToolShell
      title="تفقيط الأرقام بالعربية"
      lead="حوّل الرقم أو المبلغ إلى كلمات عربية صحيحة."
      explain={
        <>
          <p>يدعم الأرقام الهندية والفارسية والإنجليزية في الإدخال. في وضع المبلغ يُراعى مفرد الريال ومثناه وجمعه وتمييزه (ريالان، ثلاثة ريالات، أحد عشر ريالاً)، وتُضاف الهللات عند وجودها وتُختم الصيغة بعبارة «فقط لا غير».</p>
          <p>في وضع الرقم المجرد يُكتب العدد بالمذكر دون عملة. راجع النص قبل اعتماده في مستند رسمي.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Seg
              legend="النوع"
              value={mode}
              onChange={(m) => set({ mode: m })}
              options={[
                { value: 'sar', label: 'مبلغ بالريال' },
                { value: 'plain', label: 'رقم مجرد' },
              ]}
            />
            <Field label={mode === 'sar' ? 'المبلغ (ر.س)' : 'الرقم'} value={v.n} onChange={(x) => set({ n: x })} placeholder="مثال: 1250.50" error={error} />
          </div>
          <div className="actions">
            {touched && (
              <button type="button" className="btn secondary" onClick={reset}>
                مسح
              </button>
            )}
          </div>
        </section>
        <section className="panel results" aria-live="polite" aria-label="النتيجة">
          {text ? (
            <>
              <p className="big-text">{text}</p>
              {detail && (
                <dl>
                  <Line label="المقدار" value={detail} />
                </dl>
              )}
              <div className="actions">
                <button
                  type="button"
                  className="btn"
                  onClick={(e) => {
                    const b = e.currentTarget
                    navigator.clipboard
                      .writeText(text!)
                      .then(() => (b.textContent = 'تم النسخ ✓'))
                      .catch(() => (b.textContent = 'تعذّر النسخ'))
                    setTimeout(() => (b.textContent = 'نسخ النص'), 2000)
                  }}
                >
                  نسخ النص
                </button>
                <ShareButton />
              </div>
            </>
          ) : error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : (
            <p className="empty">أدخل رقمًا لعرض النص.</p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
