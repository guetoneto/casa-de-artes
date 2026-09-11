import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import ArtisticProducts from './pages/ArtisticProducts'
import Stationery from './pages/Stationery'
import Office from './pages/Office'

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
          <Route path="/papelaria" element={<Stationery />} />
          <Route path="/escritorio" element={<Office />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App