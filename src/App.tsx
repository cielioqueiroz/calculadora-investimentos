import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Simulator } from '@/pages/Simulator'
import { Comparison } from '@/pages/Comparison'
import { History } from '@/pages/History'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/simulador" element={<Simulator />} />
          <Route path="/comparar" element={<Comparison />} />
          <Route path="/historico" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
