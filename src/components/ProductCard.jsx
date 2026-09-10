function ProductCard({ product }) {
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>Casa de Artes</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.subcategory}</span>

        <h3>{product.name}</h3>

        <span className="product-brand">{product.brand}</span>

        <strong className="product-price">{formattedPrice}</strong>

        <button className="product-button" type="button">
          Ver produto
        </button>
      </div>
    </article>
  )
}

export default ProductCard