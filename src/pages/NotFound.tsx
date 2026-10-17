import { Link } from 'react-router-dom'
import { useSeo } from '../components/ui'

export default function NotFound() {
  useSeo('الصفحة غير موجودة', 'الصفحة التي تبحث عنها غير موجودة. عد إلى الرئيسية واختر إحدى الحاسبات.')
  return (
    <div className="empty" role="alert">
      <h1>الصفحة غير موجودة</h1>
      <p>ربما تغيّر الرابط. اختر إحدى الأدوات من الصفحة الرئيسية.</p>
      <p>
        <Link className="btn" to="/">
          العودة إلى الرئيسية
        </Link>
      </p>
    </div>
  )
}
