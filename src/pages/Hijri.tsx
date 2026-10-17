import { Field, Line, Seg, ShareButton, ToolShell, useSeo } from '../components/ui'
import { parseISO, todayYMD, toISO, weekdayAr } from '../lib/dates'
import {
  formatGregorian,
  formatHijri,
  gregorianToHijri,
  hijriMonthLength,
  hijriToGregorian,
  HIJRI_MAX_YEAR,
  HIJRI_MIN_YEAR,
  HIJRI_MONTHS_AR,
} from '../lib/hijri'
import { parseNum } from '../lib/format'
import { useQueryState } from '../lib/useQueryState'

export default function Hijri() {
  useSeo('محوّل التاريخ الهجري والميلادي', 'حوّل بين التاريخ الهجري (أم القرى) والميلادي فورًا، مع اليوم من الأسبوع وطول الشهر الهجري.')
  const today = todayYMD()
  const todayH = gregorianToHijri(today)
  const { values: v, set, reset, touched } = useQueryState({ mode: 'g2h', g: '', hy: '', hm: '1', hd: '' })
  const mode = v.mode === 'h2g' ? 'h2g' : 'g2h'

  let result: { from: string; to: string; weekday: string; extra?: string } | null = null
  let error: string | null = null

  if (mode === 'g2h') {
    if (v.g !== '') {
      const g = parseISO(v.g)
      if (!g) error = 'تاريخ ميلادي غير صالح'
      else {
        const h = gregorianToHijri(g)
        if (!h) error = `خارج النطاق المدعوم (${HIJRI_MIN_YEAR}–${HIJRI_MAX_YEAR}هـ)`
        else
          result = {
            from: formatGregorian(g),
            to: formatHijri(h),
            weekday: weekdayAr(g),
            extra: `طول الشهر الهجري: ${hijriMonthLength(h.y, h.m) ?? '—'} يومًا`,
          }
      }
    }
  } else if (v.hy !== '' || v.hd !== '') {
    const y = parseNum(v.hy)
    const m = parseNum(v.hm)
    const d = parseNum(v.hd)
    if (y === null || m === null || d === null || !Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
      error = 'أكمل السنة والشهر واليوم بأرقام صحيحة'
    } else if (y < HIJRI_MIN_YEAR || y > HIJRI_MAX_YEAR) {
      error = `السنة يجب أن تكون بين ${HIJRI_MIN_YEAR} و${HIJRI_MAX_YEAR}هـ`
    } else {
      const g = hijriToGregorian({ y, m, d })
      if (!g) {
        const len = hijriMonthLength(y, m)
        error = len ? `هذا الشهر ${len} يومًا فقط، ولا يوجد اليوم ${d}` : 'تاريخ هجري غير صالح'
      } else {
        result = {
          from: formatHijri({ y, m, d }),
          to: formatGregorian(g),
          weekday: weekdayAr(g),
          extra: `بصيغة ISO: ${toISO(g)}`,
        }
      }
    }
  }

  return (
    <ToolShell
      title="محوّل التاريخ الهجري والميلادي"
      lead="تحويل فوري وفق تقويم أم القرى المعتمد في المملكة."
      explain={
        <>
          <p>
            يعتمد التحويل على تقويم أم القرى عبر مكتبة <code>Intl</code> في المتصفح (<code>islamic-umalqura</code>)، ويعمل دون اتصال بالإنترنت. النطاق المدعوم من {HIJRI_MIN_YEAR} إلى {HIJRI_MAX_YEAR}هـ.
          </p>
          <p>قد يختلف التاريخ الهجري بيومٍ عن إعلان رؤية الهلال الفعلي، فالتقويم حسابي. للأمور الشرعية والرسمية راجع الإعلان الرسمي.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Seg
              legend="اتجاه التحويل"
              value={mode}
              onChange={(m) => set({ mode: m })}
              options={[
                { value: 'g2h', label: 'ميلادي ← هجري' },
                { value: 'h2g', label: 'هجري ← ميلادي' },
              ]}
            />
            {mode === 'g2h' ? (
              <Field label="التاريخ الميلادي" type="date" value={v.g} onChange={(x) => set({ g: x })} />
            ) : (
              <div className="row">
                <Field label="السنة الهجرية" value={v.hy} onChange={(x) => set({ hy: x })} inputMode="numeric" placeholder="مثال: 1447" />
                <div className="field">
                  <label htmlFor="hm">الشهر</label>
                  <select id="hm" value={v.hm} onChange={(e) => set({ hm: e.target.value })}>
                    {HIJRI_MONTHS_AR.map((n, i) => (
                      <option key={n} value={String(i + 1)}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="اليوم" value={v.hd} onChange={(x) => set({ hd: x })} inputMode="numeric" />
              </div>
            )}
          </div>
          <div className="actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => (mode === 'g2h' ? set({ g: toISO(today) }) : todayH && set({ hy: String(todayH.y), hm: String(todayH.m), hd: String(todayH.d) }))}
            >
              تاريخ اليوم
            </button>
            {touched && (
              <button type="button" className="btn secondary" onClick={reset}>
                مسح
              </button>
            )}
          </div>
        </section>
        <section className="panel results" aria-live="polite" aria-label="النتيجة">
          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : result ? (
            <>
              <p className="big-text">{result.to}</p>
              <dl>
                <Line label="التاريخ المُدخل" value={result.from} />
                <Line label="اليوم من الأسبوع" value={result.weekday} />
                {result.extra && <Line label="معلومة" value={result.extra} />}
              </dl>
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : (
            <p className="empty">أدخل تاريخًا لعرض التحويل.</p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
