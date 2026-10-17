import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { formatMoney, formatNumber } from '../lib/format'
import { numField } from '../lib/num'
import { useQueryState } from '../lib/useQueryState'
import { calcEos, serviceYears, type EosReason } from '../lib/eos'

const REASONS: { value: EosReason; label: string }[] = [
  { value: 'termination', label: 'إنهاء العقد من صاحب العمل / انتهاء المدة' },
  { value: 'resignation', label: 'استقالة العامل' },
  { value: 'leave81', label: 'ترك العامل للعمل لسبب مشروع (م81)' },
  { value: 'dismissal80', label: 'فصل لأحد أسباب المادة 80' },
]

const FRACTION_TEXT: Record<string, string> = {
  '0': 'لا مكافأة',
  '0.3333333333333333': 'ثلث المكافأة',
  '0.6666666666666666': 'ثلثا المكافأة',
  '1': 'المكافأة كاملة',
}

export default function EndOfService() {
  useSeo('حاسبة مكافأة نهاية الخدمة', 'احسب مكافأة نهاية الخدمة وفق المادتين 84 و85 من نظام العمل مع الفرق بين الاستقالة وإنهاء العقد.')
  const { values: v, set, reset, touched } = useQueryState({ wage: '', y: '', m: '', d: '', reason: 'termination' })
  const wage = numField(v.wage)
  const y = numField(v.y)
  const m = numField(v.m)
  const d = numField(v.d)
  const hasError = !!(wage.error || y.error || m.error || d.error)
  const years = serviceYears(y.value, m.value, d.value)
  const ready = !hasError && !wage.empty && years > 0
  const reason = (REASONS.find((r) => r.value === v.reason)?.value ?? 'termination') as EosReason
  const r = ready ? calcEos({ wage: wage.value, years, reason }) : null

  return (
    <ToolShell
      title="حاسبة مكافأة نهاية الخدمة"
      lead="احسب مكافأتك وفق نظام العمل السعودي، وقارن بين الاستقالة وإنهاء العقد."
      explain={
        <>
          <ul>
            <li>
              <strong>المادة 84:</strong> نصف أجر شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة بعد ذلك، ويُحتسب الكسر بالتناسب.
            </li>
            <li>
              <strong>المادة 85 (الاستقالة):</strong> لا شيء قبل سنتين، وثلث المكافأة من سنتين إلى أقل من 5، وثلثاها من 5 إلى أقل من 10، وكاملة من 10 سنوات فأكثر.
            </li>
            <li>
              <strong>المادة 81:</strong> ترك العامل العمل لسبب مشروع يستحق المكافأة كاملة.
            </li>
            <li>
              <strong>المادة 80:</strong> الفصل لأحد الأسباب المحددة فيها لا مكافأة معه.
            </li>
          </ul>
          <p>الأجر = آخر أجر شهري (الأساسي + البدلات الثابتة). الشهر يُحتسب 30 يومًا. النتيجة تقديرية.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Field label="آخر أجر شهري (ر.س)" value={v.wage} onChange={(x) => set({ wage: x })} error={wage.error} />
            <div className="row">
              <Field label="سنوات الخدمة" value={v.y} onChange={(x) => set({ y: x })} inputMode="numeric" error={y.error} />
              <Field label="أشهر" value={v.m} onChange={(x) => set({ m: x })} inputMode="numeric" error={m.error} />
              <Field label="أيام" value={v.d} onChange={(x) => set({ d: x })} inputMode="numeric" error={d.error} />
            </div>
            <Seg legend="سبب انتهاء العلاقة" value={reason} onChange={(x) => set({ reason: x })} options={REASONS} />
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
              <dl>
                <Line label="مدة الخدمة (بالسنوات)" value={formatNumber(Math.round(years * 100) / 100)} />
                <Line label="عن أول 5 سنوات (نصف شهر لكل سنة)" value={formatMoney(r.firstFiveYears)} />
                <Line label="عمّا بعد 5 سنوات (شهر لكل سنة)" value={formatMoney(r.afterFiveYears)} />
                <Line label="المكافأة الكاملة" value={formatMoney(r.fullAward)} />
                <Line label="المستحق وفق السبب" value={FRACTION_TEXT[String(r.fraction)] ?? `${Math.round(r.fraction * 100)}%`} />
                <Line label="مكافأة نهاية الخدمة المستحقة" value={formatMoney(r.award)} total />
              </dl>
              {r.fraction === 0 && (
                <p className="notice">وفق السبب المختار لا تستحق مكافأة. جرّب تغيير السبب لمقارنة الحالات.</p>
              )}
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : (
            <p className={hasError ? 'error' : 'empty'}>
              {hasError ? 'صحّح الحقول المعلَّمة لعرض النتيجة.' : 'أدخل الأجر ومدة الخدمة لعرض النتيجة.'}
            </p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
