import products from '../data/products'
import ProductCard from './ProductCard'

function FeaturedProducts() {
  const featuredProducts = products.filter(
    (product) => product.featured
  )

  return (
    <section className="featured-products" id="produtos">
      <div className="featured-container">
        <div className="featured-heading">
          <div>
            <span className="section-eyebrow">Nossa seleção</span>
            <h2>Produtos em destaque.</h2>
          </div>

          <p>
            Uma seleção de materiais para acompanhar suas ideias,
            projetos, estudos e momentos de criação.
          </p>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts