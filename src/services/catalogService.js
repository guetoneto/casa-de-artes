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
export async function getBrandsByCategory(categorySlug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      brand:brands (
        id,
        name,
        slug,
        logo_url,
        sort_order
      ),
      product_categories!inner (
        category:categories!inner (
          slug
        )
      )
    `)
    .eq('active', true)
    .eq('product_categories.categories.slug', categorySlug)

  if (error) {
    throw error
  }

  const uniqueBrands = Array.from(
    new Map(
      data
        .filter((product) => product.brand)
        .map((product) => [
          product.brand.id,
          product.brand,
        ])
    ).values()
  )

  return uniqueBrands.sort(
    (a, b) => a.sort_order - b.sort_order
  )
}