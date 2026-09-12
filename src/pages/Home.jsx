import { useEffect } from 'react'

import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'

import { getBrands } from '../services/catalogService'

import '../styles/header.css'
import '../styles/hero.css'
import '../styles/categories.css'
import '../styles/products.css'

function Home() {
  useEffect(() => {
    async function testSupabaseConnection() {
      try {
        const brands = await getBrands()
        console.log('Supabase conectado. Marcas:', brands)
      } catch (error) {
        console.error('Erro ao conectar com Supabase:', error)
      }
    }

    testSupabaseConnection()
  }, [])

  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </main>
  )
}

export default Home