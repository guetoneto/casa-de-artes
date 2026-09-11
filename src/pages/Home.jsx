import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'

import '../styles/header.css'
import '../styles/hero.css'
import '../styles/categories.css'
import '../styles/products.css'

function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </main>
  )
}

export default Home
