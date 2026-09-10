function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">
            Papelaria • Artes • Criatividade
          </span>

          <h1>
            Arte inspira
            <span> mais vida.</span>
          </h1>

          <p className="hero-description">
            Materiais para transformar ideias em projetos, estudos em
            possibilidades e criatividade em expressão.
          </p>

          <div className="hero-actions">
            <a className="hero-primary" href="#produtos">
              Explorar produtos
            </a>

            <a className="hero-secondary" href="#categorias">
              Ver categorias
            </a>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <span className="paint-stroke stroke-blue"></span>
          <span className="paint-stroke stroke-red"></span>
          <span className="paint-stroke stroke-ochre"></span>
          <span className="paint-stroke stroke-green"></span>

          <div className="hero-message">
            <span>Casa de</span>
            <strong>criatividade</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero