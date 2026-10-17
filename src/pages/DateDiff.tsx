import { Field, Line, ShareButton, ToolShell, useSeo } from '../components/ui'
import { diffYMD, parseISO, diffDays } from '../lib/dates'
import { formatNumber } from '../lib/format'
import { useQueryState } from '../lib/useQueryState'

export default function DateDiff() {
  useSeo('الفرق بين تاريخين', 'احسب الفرق بين تاريخين بالسنوات والأشهر والأيام وبإجمالي الأيام والأسابيع.')
  const { values: v, set, reset, touched } = useQueryState({ from: '', to: '' })
  const a = parseISO(v.from)
  const b = parseISO(v.to)
  const badA = v.from !== '' && !a
  const badB = v.to !== '' && !b
  const r = a && b ? diffYMD(a, b) : null
  const reversed = !!(a && b && diffDays(a, b) < 0)

  return (
    <ToolShell
      title="الفرق بين تاريخين"
      lead="اعرف المدة بين تاريخين بالسنوات والأشهر والأيام."
      explain={
        <>
          <p>يُحسب الفرق التقويمي (سنوات كاملة، ثم أشهر كاملة، ثم الأيام المتبقية)، كما يُعرض إجمالي الأيام والأسابيع. ترتيب التاريخين لا يؤثر في النتيجة؛ المدة تُحسب دائمًا من الأقدم إلى الأحدث.</p>
          <p>اليوم الأخير غير مشمول؛ للتضمين أضف يومًا إلى النتيجة.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Field label="من تاريخ" type="date" value={v.from} onChange={(x) => set({ from: x })} error={badA ? 'تاريخ غير صالح' : null} />
            <Field label="إلى تاريخ" type="date" value={v.to} onChange={(x) => set({ to: x })} error={badB ? 'تاريخ غير صالح' : null} />
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
          {r ? (
            <>
              <p className="big-text">
                {r.years} سنة و{r.months} شهر و{r.days} يوم
              </p>
              <dl>
                <Line label="إجمالي الأشهر" value={formatNumber(r.totalMonths)} />
                <Line label="إجمالي الأسابيع" value={formatNumber(r.totalWeeks)} />
                <Line label="إجمالي الأيام" value={formatNumber(r.totalDays)} total />
              </dl>
              {reversed && <p className="notice">التاريخ الأول أحدث من الثاني؛ حُسبت المدة بينهما بصرف النظر عن الترتيب.</p>}
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : (
            <p className="empty">اختر التاريخين لعرض النتيجة.</p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
