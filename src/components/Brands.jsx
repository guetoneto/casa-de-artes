import { useEffect, useState } from 'react'
import { getBrands } from '../services/catalogService'

function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrands()
        setBrands(data)
      } catch (err) {
        console.error('Erro ao carregar marcas:', err)
        setError('Não foi possível carregar as marcas.')
      } finally {
        setLoading(false)
      }
    }

    loadBrands()
  }, [])

  if (loading) {
    return (
      <section className="brands-section">
        <div className="brands-container">
          <p>Carregando marcas...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return null
  }

  return (
    <section className="brands-section" id="marcas">
      <div className="brands-container">
        <div className="brands-heading">
          <span className="section-eyebrow">Marcas</span>
          <h2>Marcas para criar sem limites.</h2>

          <p>
            Materiais de marcas que acompanham artistas,
            estudantes e profissionais em diferentes formas
            de criar.
          </p>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <article className="brand-card" key={brand.id}>
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  loading="lazy"
                />
              ) : (
                <span>{brand.name}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Brands