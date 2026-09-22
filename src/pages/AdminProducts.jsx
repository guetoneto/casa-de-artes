export default function AdminProducts() {
  return (
    <main className="admin-products">
      <div className="admin-products-container">
        <header className="admin-products-header">
          <span>Administração</span>
          <h1>Cadastro de produtos</h1>
          <p>
            Gerencie os produtos e suas variantes do catálogo
            da Casa de Artes.
          </p>
        </header>

        <section className="admin-product-form">
          <h2>Novo produto</h2>

          <div className="admin-form-grid">
            <label>
              Nome do produto
              <input
                type="text"
                placeholder="Ex.: Tinta Acrílica Corfix 250ml"
                disabled
              />
            </label>

            <label>
              Marca
              <select disabled>
                <option>Selecione uma marca</option>
              </select>
            </label>

            <label>
              Categoria
              <select disabled>
                <option>Selecione uma categoria</option>
              </select>
            </label>
          </div>

          <h3>Variante</h3>

          <div className="admin-form-grid">
            <label>
              Cor
              <input
                type="text"
                placeholder="Ex.: Azul Ultramar"
                disabled
              />
            </label>

            <label>
              Código da cor
              <input
                type="text"
                placeholder="Ex.: 68"
                disabled
              />
            </label>

            <label>
              Código de barras
              <input
                type="text"
                placeholder="Ex.: 7896011706436"
                disabled
              />
            </label>

            <label>
              Grupo
              <select disabled>
                <option>GR 1</option>
                <option>GR 2</option>
              </select>
            </label>

            <label>
              Preço
              <input
                type="text"
                placeholder="R$ 0,00"
                disabled
              />
            </label>

            <label>
              Estoque
              <input
                type="number"
                placeholder="0"
                disabled
              />
            </label>
          </div>

          <button type="button" disabled>
            Salvar produto
          </button>

          <p>
            Modo de preparação: o cadastro ainda não grava
            informações no banco.
          </p>
        </section>
      </div>
    </main>
  )
}