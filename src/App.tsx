import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Simulator } from '@/pages/Simulator'
import { Market } from '@/pages/Market'
import { Comparison } from '@/pages/Comparison'
import { History } from '@/pages/History'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/simulador" element={<Simulator />} />
            <Route path="/mercado" element={<Market />} />
            <Route path="/comparar" element={<Comparison />} />
            <Route path="/historico" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
