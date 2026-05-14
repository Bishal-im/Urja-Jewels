import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(imageFile: File | null, folder: string = 'urja-jewels'): Promise<string | null> {
  if (!imageFile || imageFile.size === 0) return null
  
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          resolve(null)
        } else {
          resolve(result?.secure_url || null)
        }
      }
    )
    
    uploadStream.end(buffer)
  })
}

export { cloudinary }
