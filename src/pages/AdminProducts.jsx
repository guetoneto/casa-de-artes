import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/admin-products.css'

import { supabase } from '../services/supabase'
import {
  getBrands,
  getCategories,
} from '../services/catalogService'


export default function AdminProducts() {
    const navigate = useNavigate()
    const [brands, setBrands] = useState([])
const [categories, setCategories] = useState([])
const [loadingCatalogData, setLoadingCatalogData] =
  useState(true)
const [catalogError, setCatalogError] = useState('')
const [productName, setProductName] = useState('')
const [brandId, setBrandId] = useState('')
const [categoryId, setCategoryId] = useState('')

useEffect(() => {
  async function loadCatalogData() {
    try {
      const [brandsData, categoriesData] =
        await Promise.all([
          getBrands(),
          getCategories(),
        ])

      setBrands(brandsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error(
        'Erro ao carregar dados do catálogo:',
        error
      )

      setCatalogError(
        'Não foi possível carregar marcas e categorias.'
      )
    } finally {
      setLoadingCatalogData(false)
    }
  }

  loadCatalogData()
}, [])

    async function handleLogout() {
      await supabase.auth.signOut()
      navigate('/admin/login')
    }
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
          <button
           type="button"
           className="admin-logout-button"
           onClick={handleLogout}
          >
           Sair
        </button>
        </header>

        {catalogError && (
          <p role="alert">{catalogError}</p>
        )}
        
        <section className="admin-product-form">
          <h2>Novo produto</h2>

          <div className="admin-form-grid">
       <label>
         Nome do produto
         <input
           type="text"
           placeholder="Ex.: Tinta Acrílica Corfix 250ml"
           value={productName}
           onChange={(event) =>
             setProductName(event.target.value)
           }
         />
       </label>

            <label>
  Marca
  <select
    value={brandId}
    onChange={(event) =>
      setBrandId(event.target.value)
    }
    disabled={loadingCatalogData}
  >
    <option value="">
      {loadingCatalogData
        ? 'Carregando marcas...'
        : 'Selecione uma marca'}
    </option>

    {brands.map((brand) => (
      <option key={brand.id} value={brand.id}>
        {brand.name}
      </option>
    ))}
  </select>
</label>

              <label>
  Categoria
  <select
    value={categoryId}
    onChange={(event) =>
      setCategoryId(event.target.value)
    }
    disabled={loadingCatalogData}
  >
    <option value="">
      {loadingCatalogData
        ? 'Carregando categorias...'
        : 'Selecione uma categoria'}
    </option>

    {categories.map((category) => (
      <option
        key={category.id}
        value={category.id}
      >
        {category.name}
      </option>
    ))}
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