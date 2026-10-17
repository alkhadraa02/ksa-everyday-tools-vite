import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SITE_NAME } from './ui'
import { TOOLS } from '../tools'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a className="skip-link" href="#main">
        تخطَّ إلى المحتوى
      </a>
      <header className="site-header">
        <div className="container header-row">
          <Link to="/" className="brand" aria-label={`${SITE_NAME} — الصفحة الرئيسية`}>
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <span>{SITE_NAME}</span>
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
        <div className="container header-wrap">
          <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="الأدوات">
            {TOOLS.map((t) => (
              <NavLink key={t.path} to={t.path}>
                {t.short.split(' ')[0] === 'تحويل' ? 'هجري/ميلادي' : navLabel(t.path)}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="container" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            {SITE_NAME} — حاسبات تعمل بالكامل في متصفحك، ولا يُرسل أي مدخل إلى خادم.
          </p>
          <p className="disclaimer">
            النتائج تقديرية للاسترشاد فقط ولا تُعدّ استشارة شرعية أو قانونية أو محاسبية.
          </p>
        </div>
      </footer>
    </>
  )
}

function navLabel(path: string): string {
  switch (path) {
    case '/vat':
      return 'الضريبة'
    case '/zakat':
      return 'الزكاة'
    case '/end-of-service':
      return 'نهاية الخدمة'
    case '/gosi':
      return 'التأمينات'
    case '/age':
      return 'العمر'
    case '/date-diff':
      return 'الفرق بين تاريخين'
    case '/number-to-words':
      return 'التفقيط'
    default:
      return path
  }
}
