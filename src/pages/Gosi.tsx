import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { formatMoney, formatNumber } from '../lib/format'
import { numField } from '../lib/num'
import { useQueryState } from '../lib/useQueryState'
import { calcGosi, GOSI_MAX_BASE, GOSI_MIN_BASE, type Nationality } from '../lib/gosi'

export default function Gosi() {
  useSeo('حاسبة التأمينات الاجتماعية', 'قدّر اشتراكات التأمينات الاجتماعية على الموظف وصاحب العمل للسعودي وغير السعودي من الراتب الأساسي وبدل السكن.')
  const { values: v, set, reset, touched } = useQueryState({ basic: '', housing: '', nat: 'saudi' })
  const basic = numField(v.basic)
  const housing = numField(v.housing)
  const nat: Nationality = v.nat === 'expat' ? 'expat' : 'saudi'
  const hasError = !!(basic.error || housing.error)
  const ready = !hasError && !basic.empty
  const r = ready ? calcGosi({ basic: basic.value, housing: housing.value, nationality: nat }) : null

  return (
    <ToolShell
      title="حاسبة التأمينات الاجتماعية"
      lead="تقدير اشتراكات الموظف وصاحب العمل في القطاع الخاص."
      explain={
        <>
          <ul>
            <li>
              وعاء الاشتراك = الراتب الأساسي + بدل السكن، بحد أدنى <strong>{formatNumber(GOSI_MIN_BASE)}</strong> وحد أقصى <strong>{formatNumber(GOSI_MAX_BASE)}</strong> ر.س.
            </li>
            <li>
              <strong>السعودي:</strong> المعاشات 9% على الموظف و9% على صاحب العمل، وساند 0.75% على كل منهما، والأخطار المهنية 2% على صاحب العمل.
            </li>
            <li>
              <strong>غير السعودي:</strong> الأخطار المهنية فقط 2% على صاحب العمل.
            </li>
          </ul>
          <p>النسب والحدود قابلة للتغيير بقرارات المؤسسة العامة للتأمينات الاجتماعية؛ هذا تقدير للاسترشاد.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Seg
              legend="الجنسية"
              value={nat}
              onChange={(x) => set({ nat: x })}
              options={[
                { value: 'saudi', label: 'سعودي' },
                { value: 'expat', label: 'غير سعودي' },
              ]}
            />
            <Field label="الراتب الأساسي (ر.س)" value={v.basic} onChange={(x) => set({ basic: x })} error={basic.error} />
            <Field label="بدل السكن (ر.س)" value={v.housing} onChange={(x) => set({ housing: x })} error={housing.error} />
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
              {r.clamped && (
                <p className="notice">
                  {r.clamped === 'min' ? 'الوعاء أقل من الحد الأدنى فاعتُمد الحد الأدنى.' : 'الوعاء أعلى من الحد الأقصى فاعتُمد الحد الأقصى.'}
                </p>
              )}
              <dl>
                <Line label="وعاء الاشتراك" value={formatMoney(r.base)} />
                {r.employee.map((l) => (
                  <Line key={l.key} label={`${l.label} ${formatNumber(l.rate * 100)}%`} value={formatMoney(l.amount)} />
                ))}
                <Line label="خصم الموظف الشهري" value={formatMoney(r.employeeTotal)} total />
                {r.employer.map((l) => (
                  <Line key={l.key} label={`${l.label} ${formatNumber(l.rate * 100)}%`} value={formatMoney(l.amount)} />
                ))}
                <Line label="التزام صاحب العمل الشهري" value={formatMoney(r.employerTotal)} total />
                <Line label="إجمالي الاشتراكات" value={formatMoney(r.total)} total />
              </dl>
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : (
            <p className={hasError ? 'error' : 'empty'}>
              {hasError ? 'صحّح الحقول المعلَّمة لعرض النتيجة.' : 'أدخل الراتب الأساسي لعرض النتيجة.'}
            </p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
