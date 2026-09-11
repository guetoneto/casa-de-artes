import { Link } from 'react-router-dom'
import logoCasaDeArtes from '../assets/logo-casa-de-artes.png'

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link
          className="brand"
          to="/"
          aria-label="Casa de Artes Papelaria - Início"
        >
          <img
            className="brand-logo"
            src={logoCasaDeArtes}
            alt="Casa de Artes Papelaria"
          />
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          <Link to="/">Início</Link>
          <Link to="/produtos-artisticos">
            Produtos Artísticos
          </Link>
          <Link to="/papelaria">Papelaria</Link>
          <Link to="/escritorio">Escritório</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header