import logoCasaDeArtes from '../assets/logo-casa-de-artes.png'

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a className="brand" href="/" aria-label="Casa de Artes Papelaria - Início">
          <img
            className="brand-logo"
            src={logoCasaDeArtes}
            alt="Casa de Artes Papelaria"
          />
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="/">Início</a>
          <a href="#artisticos">Produtos Artísticos</a>
          <a href="#papelaria">Papelaria</a>
          <a href="#escritorio">Escritório</a>
        </nav>
      </div>
    </header>
  )
}

export default Header