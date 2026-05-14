import { createClient } from '@/lib/supabase/server'

export type SiteContent = {
  id: string
  key: string
  content: any
}

export async function getSiteContent(key: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, return null
        return null
      }
      console.error(`[DB] Error fetching site content for key ${key}:`, error.message)
      return null
    }

    return data as SiteContent
  } catch (err) {
    console.error(`[DB] Unexpected error in getSiteContent for key ${key}:`, err)
    return null
  }
}

export async function updateSiteContent(key: string, content: any) {
  try {
    const supabase = await createClient()
    
    // Check if it exists
    const { data: existing } = await supabase
      .from('site_content')
      .select('id')
      .eq('key', key)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('site_content')
        .update({ content })
        .eq('key', key)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('site_content')
        .insert([{ key, content }])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  } catch (err) {
    console.error(`[DB] Error updating site content for key ${key}:`, err)
    return null
  }
}
