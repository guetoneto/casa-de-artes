import { Link } from 'react-router-dom'

const categories = [
  {
    id: 'artisticos',
    number: '01',
    title: 'Produtos Artísticos',
    description:
      'Tintas, pincéis, telas, materiais para desenho e tudo para transformar ideias em arte.',
    accent: 'blue',
    link: '/produtos-artisticos',
  },
  {
    id: 'papelaria',
    number: '02',
    title: 'Papelaria',
    description:
      'Cadernos, canetas, papéis e materiais para estudar, criar, organizar e presentear.',
    accent: 'red',
    link: '/papelaria',
  },
  {
    id: 'escritorio',
    number: '03',
    title: 'Escritório',
    description:
      'Organização, arquivo, escrita e acessórios para deixar o trabalho mais funcional.',
    accent: 'green',
    link: '/escritorio',
  },
]

function Categories() {
  return (
    <section className="categories" id="categorias">
      <div className="categories-container">
        <div className="categories-heading">
          <div>
            <span className="section-eyebrow">Explore a Casa</span>
            <h2>Encontre o que inspira você.</h2>
          </div>

          <p>
            Da criação artística à rotina de estudos e trabalho, reunimos
            materiais para diferentes formas de criar.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
                className={`category-card category-${category.accent}`}
                to={category.link}
                key={category.id}
            >
              <span className="category-number">{category.number}</span>

              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>

                <span className="category-link">
                  Explorar categoria <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories