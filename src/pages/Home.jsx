import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import Brands from '../components/Brands'


import '../styles/header.css'
import '../styles/hero.css'
import '../styles/categories.css'
import '../styles/products.css'
import '../styles/brands.css'

function Home() {
  
  return (
    <main>
      <Hero />
      <Categories />
      <Brands />
      <FeaturedProducts />
    </main>
  )
}

export default Home