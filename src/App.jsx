import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import ArtisticProducts from './pages/ArtisticProducts'
import Stationery from './pages/Stationery'
import Office from './pages/Office'
import BrandProducts from './pages/BrandProducts'
import ProductDetails from './pages/ProductDetails'
import AdminProducts from './pages/AdminProducts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/produtos-artisticos"
            element={<ArtisticProducts />}
          />
          <Route path="/papelaria" 
          element={<Stationery />} 
          />
          <Route path="/escritorio" 
          element={<Office />} 
          />
          <Route path="/:categorySlug/:brandSlug"
          element={<BrandProducts />}
          />
          <Route path="/:categorySlug/:brandSlug/:productSlug"
          element={<ProductDetails />}
          />
          <Route path="/admin/produtos"
          element={<AdminProducts />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App