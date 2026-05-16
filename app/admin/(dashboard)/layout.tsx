'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { 
  MdDashboard, 
  MdInventory2, 
  MdLanguage, 
  MdLogout, 
  MdSearch,
  MdEditNote
} from 'react-icons/md'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: MdDashboard },
    { label: 'Products', href: '/admin/products', icon: MdInventory2 },
    { label: 'Site Content', href: '/admin/site-content', icon: MdEditNote },
  ]

  // Mock breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean)
    return parts.map((part, i) => {
      const href = '/' + parts.slice(0, i + 1).join('/')
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
      return { label, href }
    })
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex font-sans text-[#0f172a]">
      {/* Sidebar Navigation */}
      <aside className="bg-[#0f172a] w-64 flex-shrink-0 sticky top-0 h-screen flex flex-col z-50 text-white/70">
        <div className="px-6 py-8 flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">Urja Admin</span>
        </div>
        
        <nav className="flex-1 px-3 flex flex-col gap-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all group ${
                  isActive 
                    ? 'text-white font-bold bg-[#4f46e5]' 
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all hover:text-white hover:bg-white/5 group"
            >
              <MdLanguage className="text-xl group-hover:text-white" />
              <span className="text-sm font-medium">View Live Site</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors hover:text-white hover:bg-red-500/10 w-full text-left group"
            >
              <MdLogout className="text-xl group-hover:text-white" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#e5eeff] flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-[#464555]">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <Link 
                  href={crumb.href} 
                  className={i === breadcrumbs.length - 1 ? 'font-bold text-[#0f172a]' : 'hover:text-[#0f172a]'}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xl" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#f1f5f9] border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#4f46e5]/20 focus:bg-white transition-all"
              />
            </div>

            <Link 
              href="/admin"
              className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#4338ca] transition-colors"
              title="Profile"
            >
              AD
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto flex flex-col">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {children}
          </div>
          
          <footer className="mt-auto px-8 py-4 border-t border-[#e5eeff] flex justify-between items-center text-sm text-[#64748b]">
            <p>© {new Date().getFullYear()} Urja Admin. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[#0f172a]">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#0f172a]">Terms of Service</Link>
              <Link href="#" className="hover:text-[#0f172a]">Help Center</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
