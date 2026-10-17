import { Field, Line, ShareButton, ToolShell, useSeo } from '../components/ui'
import { calcAge, parseISO, todayYMD, toISO, weekdayAr } from '../lib/dates'
import { formatGregorian } from '../lib/hijri'
import { formatNumber } from '../lib/format'
import { useQueryState } from '../lib/useQueryState'

export default function Age() {
  useSeo('حاسبة العمر', 'احسب العمر بدقة بالسنوات والأشهر والأيام، وكم يتبقى على عيد الميلاد القادم.')
  const { values: v, set, reset, touched } = useQueryState({ birth: '', asof: '' })
  const birth = parseISO(v.birth)
  const asof = v.asof ? parseISO(v.asof) : todayYMD()
  const badBirth = v.birth !== '' && !birth
  const badAsof = v.asof !== '' && !asof
  const r = birth && asof ? calcAge(birth, asof) : null
  const future = !!birth && !!asof && !r

  return (
    <ToolShell
      title="حاسبة العمر"
      lead="أدخل تاريخ الميلاد (ميلادي) لمعرفة عمرك بالتفصيل."
      explain={
        <>
          <p>يُحسب العمر بالفرق التقويمي: سنوات كاملة ثم أشهر كاملة ثم الأيام المتبقية. إن وُلد الشخص في 29 فبراير يُعتمد 28 فبراير في السنوات غير الكبيسة لعيد الميلاد.</p>
          <p>يمكنك تحديد «احسب العمر في تاريخ» لمعرفة العمر في يوم معين، وإلا يُستخدم تاريخ اليوم.</p>
        </>
      }
    >
      <div className="tool">
        <section className="panel" aria-label="المدخلات">
          <div className="fields">
            <Field label="تاريخ الميلاد" type="date" value={v.birth} onChange={(x) => set({ birth: x })} error={badBirth ? 'تاريخ غير صالح' : null} />
            <Field
              label="احسب العمر في تاريخ (اختياري)"
              type="date"
              value={v.asof}
              onChange={(x) => set({ asof: x })}
              hint="اتركه فارغًا لاستخدام تاريخ اليوم"
              error={badAsof ? 'تاريخ غير صالح' : null}
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
              <p className="big-text">
                {r.years} سنة و{r.months} شهر و{r.days} يوم
              </p>
              <dl>
                <Line label="إجمالي الأشهر" value={formatNumber(r.totalMonths)} />
                <Line label="إجمالي الأسابيع" value={formatNumber(r.totalWeeks)} />
                <Line label="إجمالي الأيام" value={formatNumber(r.totalDays)} />
                <Line label="عيد الميلاد القادم" value={`${formatGregorian(r.nextBirthday)} (${weekdayAr(r.nextBirthday)})`} />
                <Line label="المتبقي على عيد الميلاد" value={r.isBirthdayToday ? 'عيد ميلاد سعيد! 🎉' : `${formatNumber(r.daysUntilBirthday)} يوم`} total />
              </dl>
              {birth && <p className="hint">وُلدت يوم {weekdayAr(birth)} {toISO(birth)}</p>}
              <div className="actions">
                <ShareButton />
              </div>
            </>
          ) : future ? (
            <p className="error" role="alert">
              تاريخ الميلاد بعد تاريخ الحساب. تحقق من التواريخ.
            </p>
          ) : (
            <p className="empty">أدخل تاريخ الميلاد لعرض النتيجة.</p>
          )}
        </section>
      </div>
    </ToolShell>
  )
}
