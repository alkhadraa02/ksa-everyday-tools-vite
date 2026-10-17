import { Link } from 'react-router-dom'
import { SITE_NAME, useSeo } from '../components/ui'
import { TOOLS } from '../tools'

export default function Home() {
  useSeo(SITE_NAME, 'حاسبات سعودية مجانية تعمل في متصفحك: تحويل التاريخ الهجري والميلادي، ضريبة القيمة المضافة، الزكاة، نهاية الخدمة، التأمينات، والعمر.')
  return (
    <>
      <h1>أدوات يومية للمقيم والمواطن</h1>
      <p className="lead">
        مجموعة حاسبات سعودية دقيقة وسريعة، تعمل بالكامل في متصفحك دون تسجيل ودون إرسال بياناتك. كل نتيجة لها رابط يمكنك مشاركته.
      </p>
      <ul className="grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {TOOLS.map((t) => (
          <li key={t.path} style={{ display: 'contents' }}>
            <Link className="tool-card" to={t.path}>
              <span className="icon" aria-hidden="true">
                {t.icon}
              </span>
              <h2>{t.title}</h2>
              <p>{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
