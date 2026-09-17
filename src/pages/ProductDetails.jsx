import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductDetails } from '../services/catalogService'

import '../styles/catalog-page.css'

function ProductDetails() {
  const { productSlug } = useParams()

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductDetails(productSlug)

        setProduct(data)

        const defaultVariant =
          data.product_variants?.find(
            (variant) =>
              variant.is_default && variant.active
          ) ||
          data.product_variants?.find(
            (variant) => variant.active
          )

        setSelectedVariant(defaultVariant || null)
      } catch (err) {
        console.error('Erro ao carregar produto:', err)
        setError('Não foi possível carregar o produto.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productSlug])

  if (loading) {
    return (
      <main className="catalog-page">
        <div className="catalog-container">
          <p className="catalog-message">
            Carregando produto...
          </p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="catalog-page">
        <div className="catalog-container">
          <p className="catalog-message">
            {error || 'Produto não encontrado.'}
          </p>
        </div>
      </main>
    )
  }

  const primaryImage =
    product.product_images?.find(
      (image) => image.is_primary
    ) || product.product_images?.[0]

  const colorOption =
    product.product_options?.find(
      (option) => option.name === 'Cor'
    )

  return (
    <main className="catalog-page">
      <div className="catalog-container">
        <section className="product-details">
          <div className="product-details-image">
            {primaryImage && (
              <img
                src={primaryImage.image_url}
                alt={
                  primaryImage.alt_text ||
                  product.name
                }
              />
            )}
          </div>

          <div className="product-details-info">
            <span className="section-eyebrow">
              {product.brand?.name}
            </span>

            <h1>{product.name}</h1>

            {selectedVariant && (
              <strong className="product-details-price">
                {selectedVariant.price.toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  }
                )}
              </strong>
            )}

            {colorOption && (
              <div className="product-options">
                <h2>Cor</h2>

                <div className="product-option-buttons">
                  {colorOption.product_option_values.map(
                    (optionValue) => (
                      <button
                        type="button"
                        key={optionValue.id}
                        className="product-option-button"
                      >
                        {optionValue.value}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {selectedVariant && (
              <div className="product-stock">
                {selectedVariant.stock > 0 ? (
                  <span>
                    {selectedVariant.stock} unidades disponíveis
                  </span>
                ) : (
                  <span>Produto sem estoque</span>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetails