import Header from '../components/Header'
import Hero from '../components/Hero'
import '../styles/header.css'
import '../styles/hero.css'

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  )
}

export default Home