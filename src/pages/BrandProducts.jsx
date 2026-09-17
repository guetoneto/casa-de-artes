import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductsByCategoryAndBrand } from '../services/catalogService'

import '../styles/catalog-page.css'

function BrandProducts() {
  const { categorySlug, brandSlug } = useParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProductsByCategoryAndBrand(
          categorySlug,
          brandSlug
        )

        setProducts(data)
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
        setError('Não foi possível carregar os produtos.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categorySlug, brandSlug])

  const brand = products[0]?.brand

  return (
    <main className="catalog-page">
      <div className="catalog-container">
        <header className="catalog-heading">
          <span className="section-eyebrow">
            Produtos Artísticos
          </span>

          <h1>{brand?.name || 'Produtos'}</h1>

          <p>
            Explore os produtos disponíveis desta marca.
          </p>
        </header>

        {loading && (
          <p className="catalog-message">
            Carregando produtos...
          </p>
        )}

        {error && (
          <p className="catalog-message">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="catalog-message">
            Nenhum produto encontrado.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="brand-products-grid">
            {products.map((product) => {
              const defaultVariant =
                product.product_variants?.find(
                  (variant) =>
                    variant.is_default &&
                    variant.active
                )

              const primaryImage =
                product.product_images?.find(
                  (image) => image.is_primary
                ) || product.product_images?.[0]

              return (
                <Link
                  className="brand-product-card"
                  key={product.id}
                  to={`/${categorySlug}/${brandSlug}/${product.slug}`}
                  aria-label={`Ver ${product.name}`}
                >
                  {primaryImage && (
                    <div className="brand-product-image">
                      <img
                        src={primaryImage.image_url}
                        alt={
                          primaryImage.alt_text ||
                          product.name
                        }
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="brand-product-info">
                    <h2>{product.name}</h2>

                    {defaultVariant && (
                      <strong className="brand-product-price">
                        {defaultVariant.price.toLocaleString(
                          'pt-BR',
                          {
                            style: 'currency',
                            currency: 'BRL',
                          }
                        )}
                      </strong>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default BrandProducts