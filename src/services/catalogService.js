import { supabase } from './supabase'

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw error
  }

  return data
}