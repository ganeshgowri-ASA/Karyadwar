import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import NewsTicker from '@/components/NewsTicker'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <NewsTicker />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex w-64 shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <footer className="bg-blue-950 text-blue-300 text-xs text-center py-3 px-4">
        <p>© 2026 Karyadwar — Manufacturing Intranet Portal. All rights reserved.</p>
        <p className="mt-0.5">For IT support: <a href="mailto:helpdesk@company.com" className="hover:text-white underline">helpdesk@company.com</a></p>
      </footer>
    </div>
  )
}
