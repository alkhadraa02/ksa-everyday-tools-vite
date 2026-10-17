import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { formatMoney, formatNumber } from '../lib/format'
import { numField } from '../lib/num'
import { useQueryState } from '../lib/useQueryState'
import { calcZakat, GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, type NisabBasis } from '../lib/zakat'

const DEFAULTS = { cash: '', gg: '', gp: '', sg: '', sp: '', tg: '', debts: '', basis: 'gold' }

export default function Zakat() {
  useSeo('حاسبة الزكاة', 'احسب زكاة المال بنسبة 2.5% بعد خصم الديون ومقارنة المال بنصاب الذهب أو الفضة الذي تحدده.')
  const { values: v, set, reset, touched } = useQueryState(DEFAULTS)
  const f = {
    cash: numField(v.cash),
    gg: numField(v.gg),
    gp: numField(v.gp),
    sg: numField(v.sg),
    sp: numField(v.sp),
    tg: numField(v.tg),
    debts: numField(v.debts),
  }
  const hasError = Object.values(f).some((x) => x.error)
  const anyInput = touched && Object.values(f).some((x) => !x.empty)
  const basis: NisabBasis = v.basis === 'silver' ? 'silver' : 'gold'
  const r = hasError
    ? null
    : calcZakat({
        cash: f.cash.value,
        goldGrams: f.gg.value,
        goldPricePerGram: f.gp.value,
        silverGrams: f.sg.value,
        silverPricePerGram: f.sp.value,
        tradeGoods: f.tg.value,
        debts: f.debts.value,
        basis,
      })

  return (
    <ToolShell
      title="حاسبة الزكاة"
      lead="أدخل أموالك الزكوية وأسعار المعادن، وسنقارنها بالنصاب ونحسب الزكاة."
      explain={
        <>
          <ul>
            <li>إجمالي المال = النقد + (جرامات الذهب × سعر الجرام) + (جرامات الفضة × سعر الجرام) + عروض التجارة.</li>
            <li>صافي المال = الإجمالي − الديون الحالّة.</li>
            <li>
              النصاب: <strong>{GOLD_NISAB_GRAMS} جرامًا</strong> من الذهب، أو <strong>{SILVER_NISAB_GRAMS} جرامًا</strong> من الفضة، مضروبًا في سعر الجرام الذي تدخله.
            </li>
            <li>إن بلغ صافي المال النصاب وحال عليه الحول فالزكاة 2.5% من صافي المال.</li>
          </ul>
          <p>أسعار الذهب والفضة تتغير يوميًا؛ أدخل سعر الجرام الحالي من مصدر موثوق. الحاسبة لا تتحقق من مرور الحول.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Field label="النقد والأرصدة البنكية (ر.س)" value={v.cash} onChange={(x) => set({ cash: x })} error={f.cash.error} />
            <div className="row">
              <Field label="الذهب (جرام)" value={v.gg} onChange={(x) => set({ gg: x })} error={f.gg.error} />
              <Field label="سعر جرام الذهب (ر.س)" value={v.gp} onChange={(x) => set({ gp: x })} error={f.gp.error} />
            </div>
            <div className="row">
              <Field label="الفضة (جرام)" value={v.sg} onChange={(x) => set({ sg: x })} error={f.sg.error} />
              <Field label="سعر جرام الفضة (ر.س)" value={v.sp} onChange={(x) => set({ sp: x })} error={f.sp.error} />
            </div>
            <Field label="عروض التجارة (ر.س)" value={v.tg} onChange={(x) => set({ tg: x })} error={f.tg.error} />
            <Field label="الديون الحالّة (ر.س)" value={v.debts} onChange={(x) => set({ debts: x })} error={f.debts.error} />
            <Seg
              legend="النصاب المعتمد"
              value={basis}
              onChange={(b) => set({ basis: b })}
              options={[
                { value: 'gold', label: `الذهب (${GOLD_NISAB_GRAMS} جم)` },
                { value: 'silver', label: `الفضة (${SILVER_NISAB_GRAMS} جم)` },
              ]}
            />
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
          {!r ? (
            <p className="error" role="alert">
              صحّح الحقول المعلَّمة لعرض النتيجة.
            </p>
          ) : !anyInput ? (
            <p className="empty">أدخل أموالك لعرض النتيجة.</p>
          ) : (
            <>
              {r.needsPrice && (
                <p className="notice">أدخل سعر جرام {basis === 'gold' ? 'الذهب' : 'الفضة'} لتحديد قيمة النصاب.</p>
              )}
              <dl>
                <Line label="إجمالي المال" value={formatMoney(r.totalAssets)} />
                <Line label="صافي المال بعد الديون" value={formatMoney(r.netWealth)} />
                <Line label={`النصاب (${formatNumber(r.nisabGrams)} جم)`} value={r.needsPrice ? '—' : formatMoney(r.nisabValue)} />
                <Line label="هل بلغ النصاب؟" value={r.needsPrice ? '—' : r.isDue ? 'نعم' : 'لا'} />
                <Line label="الزكاة الواجبة (2.5%)" value={formatMoney(r.zakat)} total />
              </dl>
              <div className="actions">
                <ShareButton />
              </div>
            </>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
