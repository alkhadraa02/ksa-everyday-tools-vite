import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { formatMoney, parseNum } from '../lib/format'
import { addVat, extractVat, VAT_RATE } from '../lib/vat'
import { useQueryState } from '../lib/useQueryState'

export default function Vat() {
  useSeo('حاسبة ضريبة القيمة المضافة 15%', 'أضف ضريبة القيمة المضافة 15% إلى السعر أو استخرجها من سعر شامل الضريبة، مع تفصيل المبلغ والضريبة.')
  const { values: v, set, reset, touched } = useQueryState({ mode: 'add', amount: '' })
  const amount = parseNum(v.amount)
  const bad = v.amount.trim() !== '' && (amount === null || amount < 0)
  const r = amount !== null && amount >= 0 ? (v.mode === 'extract' ? extractVat(amount) : addVat(amount)) : null

  return (
    <ToolShell
      title="حاسبة ضريبة القيمة المضافة 15%"
      lead="أضف الضريبة إلى سعر قبل الضريبة، أو استخرجها من سعر شامل."
      explain={
        <>
          <p>
            نسبة ضريبة القيمة المضافة في المملكة <strong>{VAT_RATE * 100}%</strong>.
          </p>
          <ul>
            <li>
              <strong>إضافة الضريبة:</strong> الضريبة = السعر × 0.15، والإجمالي = السعر + الضريبة.
            </li>
            <li>
              <strong>استخراج الضريبة:</strong> السعر قبل الضريبة = الإجمالي ÷ 1.15، والضريبة = الإجمالي − السعر قبل الضريبة.
            </li>
          </ul>
          <p>تُقرَّب المبالغ إلى أقرب هللة.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Seg
              legend="نوع الحساب"
              value={v.mode}
              onChange={(m) => set({ mode: m })}
              options={[
                { value: 'add', label: 'إضافة الضريبة' },
                { value: 'extract', label: 'استخراج الضريبة' },
              ]}
            />
            <Field
              label={v.mode === 'extract' ? 'المبلغ شامل الضريبة (ر.س)' : 'المبلغ قبل الضريبة (ر.س)'}
              value={v.amount}
              onChange={(a) => set({ amount: a })}
              placeholder="مثال: 1000"
              error={bad ? 'أدخل مبلغًا صحيحًا غير سالب' : null}
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
          {r ? (
            <>
              <dl>
                <Line label="المبلغ قبل الضريبة" value={formatMoney(r.net)} />
                <Line label="ضريبة القيمة المضافة (15%)" value={formatMoney(r.vat)} />
                <Line label="الإجمالي شامل الضريبة" value={formatMoney(r.gross)} total />
              </dl>
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : (
            <p className="empty">{bad ? 'صحّح المبلغ لعرض النتيجة.' : 'أدخل مبلغًا لعرض النتيجة.'}</p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
