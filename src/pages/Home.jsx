import Header from '../components/Header'
import Hero from '../components/Hero'
import Categories from '../components/Categories'

import '../styles/header.css'
import '../styles/hero.css'
import '../styles/categories.css'

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Categories />
      </main>
    </>
  )
}

export default Home