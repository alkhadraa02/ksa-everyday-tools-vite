# أدوات يومية — Saudi Everyday Tools

حاسبات سعودية تعمل بالكامل في المتصفح (Vite + React + TypeScript) — بلا خادم وبلا مفاتيح وبلا إرسال بيانات.
Saudi everyday calculators that run entirely client-side. No backend, no API keys, no data leaves the browser.

## المزايا | Features

| الأداة | المسار | Route |
| --- | --- | --- |
| محوّل التاريخ الهجري/الميلادي (أم القرى عبر `Intl`) | `/hijri` | Hijri ⇄ Gregorian (Umm al-Qura) |
| ضريبة القيمة المضافة 15% (إضافة/استخراج) | `/vat` | VAT 15% add / extract |
| حاسبة الزكاة (نقد، ذهب، فضة، نصاب، ديون) | `/zakat` | Zakat with gold/silver nisab |
| مكافأة نهاية الخدمة (م84، م85: استقالة مقابل إنهاء عقد، م80، م81) | `/end-of-service` | End-of-service gratuity |
| تقدير اشتراكات التأمينات (GOSI) | `/gosi` | GOSI contribution estimator |
| حاسبة العمر | `/age` | Age calculator |
| الفرق بين تاريخين | `/date-diff` | Date difference |
| تفقيط الأرقام والمبالغ بالعربية | `/number-words` | Arabic number to words |

- كل أداة لها مسارها وشرح طريقة الحساب وحالات فارغة وخطأ واضحة.
- مدخلات كل أداة محفوظة في رابط الصفحة (`?amount=1000&mode=extract`) فيمكن مشاركة النتيجة.
- واجهة عربية RTL بخصائص CSS منطقية، خط IBM Plex Sans Arabic، متجاوبة وسهلة الوصول.
- Every tool has its own route, explanations, empty/error states, and shareable URL query params.

## لقطات الشاشة | Screenshots

أضف لقطاتك في `docs/screenshots/` ثم اربطها هنا. | Add your screenshots to `docs/screenshots/` and link them here.

## التقنيات | Stack

Vite 7 · React 19 · TypeScript · React Router · Vitest · `@fontsource/ibm-plex-sans-arabic`

## التشغيل في 5 أوامر | Setup in 5 commands

```bash
git clone <repo-url> ksa-everyday-tools
cd ksa-everyday-tools
npm install
npm test
npm run dev   # http://localhost:3112
```

الأوامر الأخرى | Other scripts: `npm run build` (type-check + production build), `npm run preview`.

لا يوجد مستخدم إداري ولا قاعدة بيانات في هذا المشروع. | There is no admin login or database in this project.

## الاختبارات | Tests

`npm test` يشغّل اختبارات Vitest لكل معادلة: الضريبة، الزكاة، نهاية الخدمة، التأمينات، التواريخ، الهجري، التفقيط.

## هيكل المشروع | Project structure

```
src/
  lib/          الحسابات النقية + اختباراتها (vat, zakat, eos, gosi, dates, hijri, words)
  pages/        صفحة لكل أداة
  components/   Layout + مكوّنات الحقول والنتائج
  tools.ts      فهرس الأدوات
  index.css     نظام التصميم (متغيّرات CSS)
public/         favicon (robots.txt, sitemap.xml, llms.txt are generated at build by vite.config.ts)
```

## تنبيه | Disclaimer

النتائج تقديرية للاسترشاد ولا تُعدّ استشارة شرعية أو قانونية أو محاسبية. Estimates only — not legal, religious or accounting advice.

## الرخصة | License

MIT © TechnologyKSA
