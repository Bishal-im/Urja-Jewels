import { getProducts } from '@/lib/db'
import Link from 'next/link'
import { MdInventory2, MdStar, MdArrowForward } from 'react-icons/md'

export default async function AdminDashboard() {
  const products = await getProducts()
  
  const totalProducts = products.length
  const featuredProducts = products.filter(p => p.featured).length
  
  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: MdInventory2,
      color: 'text-[#3525cd]',
      bg: 'bg-[#4f46e5]/10',
      href: '/admin/products'
    },
    {
      label: 'Featured Products',
      value: featuredProducts,
      icon: MdStar,
      color: 'text-[#005338]',
      bg: 'bg-[#6ffbbe]/20',
      href: '/admin/products?featured=true'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1c30]">Dashboard</h1>
        <p className="text-[#464555] mt-1">Welcome back. Here is what is happening with your collection today.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-[#d3e4fe] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`text-2xl ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#464555]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#0b1c30]">{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#f8f9ff] border-t border-[#d3e4fe] flex justify-between items-center group cursor-pointer">
                <Link href={stat.href} className="text-sm font-semibold text-[#3525cd] flex items-center gap-1">
                  View details
                  <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Quick Actions / Recent activity placeholder */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#0b1c30] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products" className="p-4 bg-white border border-[#d3e4fe] rounded-xl flex items-center justify-center gap-2 font-semibold text-[#3525cd] hover:bg-[#4f46e5] hover:text-white transition-all shadow-sm">
            Add New Product
          </Link>
        </div>
      </div>
    </div>
  )
}
