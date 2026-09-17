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
    .eq(
      'product_categories.categories.slug',
      categorySlug
    )

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

export async function getProductsByCategoryAndBrand(
  categorySlug,
  brandSlug
) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      short_description,
      featured,
      brand:brands!inner (
        id,
        name,
        slug,
        logo_url
      ),
      product_categories!inner (
        category:categories!inner (
          id,
          name,
          slug
        )
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      ),
      product_variants (
        id,
        price,
        stock,
        active,
        is_default
      )
    `)
    .eq('active', true)
    .eq('brands.slug', brandSlug)
    .eq(
      'product_categories.categories.slug',
      categorySlug
    )

  if (error) {
    throw error
  }

  return data
}

export async function getProductDetails(productSlug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      brand:brands (
        id,
        name,
        slug,
        logo_url
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      ),
      product_options (
        id,
        name,
        display_type,
        sort_order,
        product_option_values (
          id,
          value,
          color_hex,
          sort_order
        )
      ),
      product_variants (
        id,
        sku,
        barcode,
        price,
        stock,
        is_default,
        active,
        variant_option_values (
          option_value_id
        )
      )
    `)
    .eq('slug', productSlug)
    .eq('active', true)
    .single()

  if (error) {
    throw error
  }

  return data
}
  
