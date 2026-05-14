import { getProductById } from '@/lib/db'
import { editProduct } from '@/app/actions/products'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  // Await the params object itself before accessing its properties (Next.js 15+ requirement if used, but safe in 14 too)
  const resolvedParams = await params
  const product = await getProductById(resolvedParams.id)

  if (!product) {
    notFound()
  }

  // We bind the ID to the server action
  const updateProductAction = editProduct.bind(null, product.id)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-stone-900 sm:text-3xl sm:truncate">
            Edit Product
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2 border border-stone-300 rounded-md shadow-sm text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
          >
            Cancel
          </Link>
        </div>
      </div>

      <form action={updateProductAction} className="space-y-8 divide-y divide-stone-200">
        <div className="space-y-8 divide-y divide-stone-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={product.name}
                  className="max-w-lg block w-full shadow-sm focus:ring-stone-900 focus:border-stone-900 sm:max-w-xs sm:text-sm border-stone-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="slug" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Slug
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  defaultValue={product.slug}
                  className="max-w-lg block w-full shadow-sm focus:ring-stone-900 focus:border-stone-900 sm:max-w-xs sm:text-sm border-stone-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="price" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Price (in cents)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  defaultValue={product.price}
                  className="max-w-lg block w-full shadow-sm focus:ring-stone-900 focus:border-stone-900 sm:max-w-xs sm:text-sm border-stone-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="category" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Category
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={product.category}
                  className="max-w-lg block focus:ring-stone-900 focus:border-stone-900 w-full shadow-sm sm:max-w-xs sm:text-sm border-stone-300 rounded-md p-2 border bg-white"
                >
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="earrings">Earrings</option>
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  defaultValue={product.description}
                  className="max-w-lg shadow-sm block w-full focus:ring-stone-900 focus:border-stone-900 sm:text-sm border border-stone-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="featured" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Featured Product
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 flex items-center h-5 pt-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={product.featured}
                  className="focus:ring-stone-900 h-4 w-4 text-stone-900 border-stone-300 rounded"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-stone-200 sm:pt-5">
              <label htmlFor="image" className="block text-sm font-medium text-stone-700 sm:mt-px sm:pt-2">
                Product Image
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {product.imageSrc && (
                  <div className="mb-4">
                    <p className="text-sm text-stone-500 mb-2">Current Image:</p>
                    <div className="relative h-48 w-48 rounded border border-stone-200 overflow-hidden">
                      <Image src={product.imageSrc} alt={product.name} fill className="object-cover" />
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  className="max-w-lg block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100"
                />
                <p className="mt-2 text-sm text-stone-500">
                  Upload a new image to replace the current one. Leave empty to keep the current image.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
