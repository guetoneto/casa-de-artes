import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'

import '../styles/header.css'
import '../styles/hero.css'
import '../styles/categories.css'

import FeaturedProducts from '../components/FeaturedProducts'
import '../styles/products.css'

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
      </main>
    </>
  )
}

export default Home