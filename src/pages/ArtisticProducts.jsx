import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBrandsByCategory } from '../services/catalogService'

import '../styles/catalog-page.css'

function ArtisticProducts() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrandsByCategory(
          'produtos-artisticos'
        )

        setBrands(data)
      } catch (err) {
        console.error(
          'Erro ao carregar marcas de produtos artísticos:',
          err
        )
        setError('Não foi possível carregar as marcas.')
      } finally {
        setLoading(false)
      }
    }

    loadBrands()
  }, [])

  return (
    <main className="catalog-page">
      <div className="catalog-container">
        <header className="catalog-heading">
          <span className="section-eyebrow">
            Catálogo artístico
          </span>

          <h1>Produtos Artísticos</h1>

          <p>
            Encontre materiais para pintura, desenho e diferentes
            formas de expressão artística.
          </p>
        </header>

        <section>
          <h2 className="catalog-brands-title">
            Explore por marca
          </h2>

          {loading && (
            <p className="catalog-message">
              Carregando marcas...
            </p>
          )}

          {error && (
            <p className="catalog-message">{error}</p>
          )}

          {!loading && !error && (
            <div className="catalog-brands-grid">
              {brands.map((brand) => (
                <Link
                  className="catalog-brand-card"
                  key={brand.id}
                  to={`/produtos-artisticos/${brand.slug}`}
                  aria-label={`Ver produtos ${brand.name}`}
                >
                  {brand.logo_url ? (
                    <img
                     src={brand.logo_url}
                     alt={brand.name}
                     loading="lazy"
                   />
                  ) : (
                    <strong>{brand.name}</strong>
                  )}

                  <strong>{brand.name}</strong>
              </Link>
          ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ArtisticProducts