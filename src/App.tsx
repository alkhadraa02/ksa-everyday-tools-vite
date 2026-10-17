import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const Hijri = lazy(() => import('./pages/Hijri'))
const Vat = lazy(() => import('./pages/Vat'))
const Zakat = lazy(() => import('./pages/Zakat'))
const EndOfService = lazy(() => import('./pages/EndOfService'))
const Gosi = lazy(() => import('./pages/Gosi'))
const Age = lazy(() => import('./pages/Age'))
const DateDiff = lazy(() => import('./pages/DateDiff'))
const NumberToWords = lazy(() => import('./pages/NumberToWords'))

export default function App() {
  return (
    <Suspense fallback={<p className="loading" role="status">جارٍ التحميل…</p>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hijri" element={<Hijri />} />
          <Route path="vat" element={<Vat />} />
          <Route path="zakat" element={<Zakat />} />
          <Route path="end-of-service" element={<EndOfService />} />
          <Route path="gosi" element={<Gosi />} />
          <Route path="age" element={<Age />} />
          <Route path="date-diff" element={<DateDiff />} />
          <Route path="number-to-words" element={<NumberToWords />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
