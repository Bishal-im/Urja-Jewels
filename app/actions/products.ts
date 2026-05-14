'use server'

import { createProduct, updateProduct, deleteProduct as dbDeleteProduct, getProducts, getProductBySlug, getStaticProducts, getStaticProductBySlug } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import path from 'path'
import { Product } from '@/lib/constants'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function getProductsAction() {
  const products = await getProducts()
  return products
}

export async function getProductBySlugAction(slug: string) {
  return await getStaticProductBySlug(slug)
}



export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseInt(formData.get('price') as string, 10)
  const category = formData.get('category') as Product['category']
  const description = formData.get('description') as string
  const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on'
  const imageFile = formData.get('image') as File | null
  
  const imageSrc = await uploadToCloudinary(imageFile, 'urja-jewels/products') || '' // Fallback to empty if no image
  
  await createProduct({
    name,
    slug,
    price,
    category,
    description,
    featured,
    imageSrc,
  })
  
  revalidatePath('/')
  revalidatePath('/collection')
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function editProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseInt(formData.get('price') as string, 10)
  const category = formData.get('category') as Product['category']
  const description = formData.get('description') as string
  const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on'
  const imageFile = formData.get('image') as File | null
  
  const updates: Partial<Product> = {
    name,
    slug,
    price,
    category,
    description,
    featured,
  }
  
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadToCloudinary(imageFile, 'urja-jewels/products')
    if (uploadedPath) {
      updates.imageSrc = uploadedPath
    }
  }
  
  await updateProduct(id, updates)
  
  revalidatePath('/')
  revalidatePath('/collection')
  revalidatePath(`/product/${slug}`)
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function removeProduct(id: string) {
  await dbDeleteProduct(id)
  
  revalidatePath('/')
  revalidatePath('/collection')
  revalidatePath('/admin/products')
}
