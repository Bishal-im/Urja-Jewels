import { getProductById } from '@/lib/db'
import { notFound } from 'next/navigation'
import EditProductForm from './EditProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const product = await getProductById(resolvedParams.id)

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}
