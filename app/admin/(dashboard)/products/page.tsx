import { getProducts } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { removeProduct } from '@/app/actions/products'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0b1c30]">Products</h1>
          <p className="text-[#464555] mt-1">A list of all the products in your collection.</p>
        </div>
        <div>
          <Link
            href="/admin/products/new"
            className="bg-[#3525cd] hover:bg-[#4d44e3] text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer inline-block"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#d3e4fe] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#d3e4fe] bg-[#f8f9ff]">
                <th className="font-semibold text-xs uppercase tracking-wider text-[#464555] py-4 px-6" scope="col">Product</th>
                <th className="font-semibold text-xs uppercase tracking-wider text-[#464555] py-4 px-6" scope="col">Category</th>
                <th className="font-semibold text-xs uppercase tracking-wider text-[#464555] py-4 px-6" scope="col">Price</th>
                <th className="font-semibold text-xs uppercase tracking-wider text-[#464555] py-4 px-6" scope="col">Status</th>
                <th className="font-semibold text-xs uppercase tracking-wider text-[#464555] py-4 px-6 text-right" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3e4fe]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#f8f9ff] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded border border-[#d3e4fe] overflow-hidden bg-[#e5eeff] flex-shrink-0 relative">
                        {product.imageSrc && (
                          <Image
                            src={product.imageSrc}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0b1c30]">{product.name}</span>
                        <span className="text-xs text-[#777587]">{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#464555] capitalize">{product.category}</td>
                  <td className="py-4 px-6 text-sm text-[#0b1c30] font-medium">${(product.price / 100).toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {product.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6ffbbe]/20 text-[#005236]">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d3e4fe] text-[#3f465c]">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/products/${product.id}`} className="text-sm font-bold text-[#3525cd] hover:underline">
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server'
                        await removeProduct(product.id)
                      }}>
                        <button type="submit" className="text-sm font-bold text-[#ba1a1a] hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
