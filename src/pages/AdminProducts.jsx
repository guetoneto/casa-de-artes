import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/admin-products.css'

import { supabase } from '../services/supabase'
import {
  getBrands,
  getCategories,
  getProductsByBrand,
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
const [colorName, setColorName] = useState('')
const [colorCode, setColorCode] = useState('')
const [barcode, setBarcode] = useState('')
const [priceGroup, setPriceGroup] = useState('GR 1')
const [price, setPrice] = useState('')
const [stock, setStock] = useState('')
const [formMessage, setFormMessage] = useState('')
const [savingProduct, setSavingProduct] = useState(false)
const [variantBrandId, setVariantBrandId] = useState('')
const [productsByBrand, setProductsByBrand] = useState([])
const [variantProductId, setVariantProductId] = useState('')
const [loadingProducts, setLoadingProducts] = useState(false)
const [variantMessage, setVariantMessage] = useState('')
const [optionName, setOptionName] = useState('Cor')
const [optionValue, setOptionValue] = useState('')
const [optionCode, setOptionCode] = useState('')
const [variantBarcode, setVariantBarcode] = useState('')
const [variantPriceGroup, setVariantPriceGroup] = useState('GR 1')
const [variantPrice, setVariantPrice] = useState('')
const [variantStock, setVariantStock] = useState('')
const [savingVariant, setSavingVariant] = useState(false)

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

useEffect(() => {
  async function loadProductsByBrand() {
    setVariantProductId('')
    setProductsByBrand([])
    setVariantMessage('')

    if (!variantBrandId) {
      return
    }

    setLoadingProducts(true)

    try {
      const products = await getProductsByBrand(
        variantBrandId
      )

      setProductsByBrand(products)
    } catch (error) {
      console.error(
        'Erro ao carregar produtos da marca:',
        error
      )

      setVariantMessage(
        'Não foi possível carregar os produtos desta marca.'
      )
    } finally {
      setLoadingProducts(false)
    }
  }

  loadProductsByBrand()
}, [variantBrandId])

function validateForm() {
  if (!productName.trim()) {
    return 'Informe o nome do produto.'
  }

  if (!brandId) {
    return 'Selecione uma marca.'
  }

  if (!categoryId) {
    return 'Selecione uma categoria.'
  }

  if (!colorName.trim()) {
    return 'Informe a cor da variante.'
  }

  if (!barcode.trim()) {
    return 'Informe o código de barras.'
  }

  if (!/^\d+$/.test(barcode.trim())) {
    return 'O código de barras deve conter apenas números.'
  }

  const normalizedPrice = price
    .trim()
    .replace(',', '.')

  const numericPrice = Number(normalizedPrice)

  if (
    !normalizedPrice ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    return 'Informe um preço válido.'
  }

  const numericStock = Number(stock)

  if (
    stock === '' ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    return 'Informe um estoque válido.'
  }

  return ''
}

function validateVariantForm() {
  if (!variantBrandId) {
    return 'Selecione uma marca.'
  }

  if (!variantProductId) {
    return 'Selecione um produto.'
  }

  if (!optionName.trim()) {
    return 'Informe o tipo de opção.'
  }

  if (!optionValue.trim()) {
    return 'Informe o valor da opção.'
  }

  if (!variantBarcode.trim()) {
    return 'Informe o código de barras.'
  }

  if (!/^\d+$/.test(variantBarcode.trim())) {
    return 'O código de barras deve conter apenas números.'
  }

  const normalizedPrice = variantPrice
    .trim()
    .replace(',', '.')

  const numericPrice = Number(normalizedPrice)

  if (
    !normalizedPrice ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    return 'Informe um preço válido.'
  }

  const numericStock = Number(variantStock)

  if (
    variantStock === '' ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    return 'Informe um estoque válido.'
  }

  return ''
}

async function handleSaveVariant() {
  const validationError = validateVariantForm()

  if (validationError) {
    setVariantMessage(validationError)
    return
  }

  const selectedProduct = productsByBrand.find(
    (product) => product.id === variantProductId
  )

  const selectedBrand = brands.find(
    (brand) => brand.id === variantBrandId
  )

  const confirmed = window.confirm(
    `Confirma o cadastro desta variante?\n\n` +
      `Marca: ${selectedBrand?.name}\n` +
      `Produto: ${selectedProduct?.name}\n` +
      `${optionName}: ${optionValue}\n` +
      `Código: ${optionCode || 'Não informado'}\n` +
      `Código de barras: ${variantBarcode}`
  )

  if (!confirmed) {
    setVariantMessage('Cadastro cancelado.')
    return
  }

  const normalizedPrice = variantPrice
    .trim()
    .replace(',', '.')

  setSavingVariant(true)
  setVariantMessage('Salvando variante...')

  try {
    const { data, error } = await supabase.rpc(
      'create_admin_product_variant',
      {
        p_product_id: variantProductId,
        p_option_name: optionName.trim(),
        p_option_value: optionValue.trim(),
        p_option_code: optionCode.trim() || null,
        p_barcode: variantBarcode.trim(),
        p_price_group: variantPriceGroup,
        p_price: Number(normalizedPrice),
        p_stock: Number(variantStock),
      }
    )

    if (error) {
      throw error
    }

    console.log('Variante criada:', data)

    setVariantMessage('Variante cadastrada com sucesso!')

    setOptionValue('')
    setOptionCode('')
    setVariantBarcode('')
    setVariantPriceGroup('GR 1')
    setVariantPrice('')
    setVariantStock('')
  } catch (error) {
    console.error(
      'Erro ao cadastrar variante:',
      error
    )

    setVariantMessage(
      error.message ||
        'Não foi possível cadastrar a variante.'
    )
  } finally {
    setSavingVariant(false)
  }
}

async function handleSaveProduct() {
  const validationError = validateForm()

  if (validationError) {
    setFormMessage(validationError)
    return
  }

  const normalizedPrice = price
    .trim()
    .replace(',', '.')

  setSavingProduct(true)
  setFormMessage('Salvando produto...')

  try {
    const { data, error } = await supabase.rpc(
      'create_admin_product',
      {
        p_name: productName.trim(),
        p_brand_id: brandId,
        p_category_id: categoryId,
        p_color_name: colorName.trim(),
        p_color_code: colorCode.trim() || null,
        p_barcode: barcode.trim(),
        p_price_group: priceGroup,
        p_price: Number(normalizedPrice),
        p_stock: Number(stock),
      }
    )

    if (error) {
      throw error
    }

    console.log('Produto criado:', data)

    setFormMessage('Produto cadastrado com sucesso!')

    setProductName('')
    setBrandId('')
    setCategoryId('')
    setColorName('')
    setColorCode('')
    setBarcode('')
    setPriceGroup('GR 1')
    setPrice('')
    setStock('')
  } catch (error) {
    console.error(
      'Erro ao cadastrar produto:',
      error
    )

    setFormMessage(
      error.message ||
        'Não foi possível cadastrar o produto.'
    )
  } finally {
    setSavingProduct(false)
  }
}
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
                value={colorName}
                onChange={(event) =>
                  setColorName(event.target.value)
                }
              />
            </label>

            <label>
              Código da cor
              <input
                type="text"
                placeholder="Ex.: 68"
                value={colorCode}
                onChange={(event) =>
                  setColorCode(event.target.value)
                }
              />
            </label>

            <label>
              Código de barras
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ex.: 7896011706436"
                value={barcode}
                onChange={(event) =>
                  setBarcode(event.target.value)
                }
              />
            </label>

            <label>
              Grupo
              <select
                value={priceGroup}
                onChange={(event) =>
                  setPriceGroup(event.target.value)
                }
               >
                <option value="GR 1">GR 1</option>
                <option value="GR 2">GR 2</option>
              </select>
             </label>

            <label>
                Preço
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex.: 52,00"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                 />
            </label>

            <label>
                Estoque
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                 />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={savingProduct}
          >
  {savingProduct ? 'Salvando...' : 'Salvar produto'}
</button>
          
          {formMessage && (
           <p role="status">{formMessage}</p>
         )}

        </section>

        <section className="admin-product-form">
          <h2>Adicionar variante</h2>

        <p>
          Selecione uma marca e um produto existente para
          cadastrar uma nova variante.
        </p>

        <div className="admin-form-grid">
          <label>
            Marca
            <select
              value={variantBrandId}
              onChange={(event) =>
                setVariantBrandId(event.target.value)
             }
             disabled={loadingCatalogData}
           >
             <option value="">
               Selecione uma marca
             </option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
               {brand.name}
             </option>
           ))}
         </select>
        </label>

    <label>
      Produto
      <select
        value={variantProductId}
        onChange={(event) =>
          setVariantProductId(event.target.value)
        }
        disabled={
          !variantBrandId || loadingProducts
        }
      >
        <option value="">
          {loadingProducts
            ? 'Carregando produtos...'
            : 'Selecione um produto'}
        </option>

        {productsByBrand.map((product) => (
          <option
            key={product.id}
            value={product.id}
          >
            {product.name}
          </option>
        ))}
      </select>
    </label>
  </div>

  {variantProductId && (
  <div className="admin-selected-product">
    <span>Variante será adicionada a</span>

    <strong>
      {brands.find(
        (brand) => brand.id === variantBrandId
      )?.name}
    </strong>

    <p>
      {productsByBrand.find(
        (product) => product.id === variantProductId
      )?.name}
    </p>
  </div>
)}

  <h3>Nova variante</h3>

<div className="admin-form-grid">
  <label>
    Tipo de opção
    <input
      type="text"
      placeholder="Ex.: Cor, Quantidade, Tamanho"
      value={optionName}
      onChange={(event) =>
        setOptionName(event.target.value)
      }
    />
  </label>

  <label>
    Valor da opção
    <input
      type="text"
      placeholder="Ex.: Azul Ultramar"
      value={optionValue}
      onChange={(event) =>
        setOptionValue(event.target.value)
      }
    />
  </label>

  <label>
    Código da opção
    <input
      type="text"
      placeholder="Ex.: 68"
      value={optionCode}
      onChange={(event) =>
        setOptionCode(event.target.value)
      }
    />
  </label>

  <label>
    Código de barras
    <input
      type="text"
      inputMode="numeric"
      placeholder="Ex.: 7896011706436"
      value={variantBarcode}
      onChange={(event) =>
        setVariantBarcode(event.target.value)
      }
    />
  </label>

  <label>
    Grupo
    <select
      value={variantPriceGroup}
      onChange={(event) =>
        setVariantPriceGroup(event.target.value)
      }
    >
      <option value="GR 1">GR 1</option>
      <option value="GR 2">GR 2</option>
    </select>
  </label>

  <label>
    Preço
    <input
      type="text"
      inputMode="decimal"
      placeholder="Ex.: 9,50"
      value={variantPrice}
      onChange={(event) =>
        setVariantPrice(event.target.value)
      }
    />
  </label>

  <label>
    Estoque
    <input
      type="number"
      min="0"
      step="1"
      placeholder="0"
      value={variantStock}
      onChange={(event) =>
        setVariantStock(event.target.value)
      }
    />
  </label>
</div>

<button
  type="button"
  onClick={handleSaveVariant}
  disabled={savingVariant}
>
  {savingVariant
    ? 'Salvando...'
    : 'Adicionar variante'}
</button>

  {variantMessage && (
    <p role="status">{variantMessage}</p>
  )}
</section>
      </div>
    </main>
  )
}