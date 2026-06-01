import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <Header />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  )
}
