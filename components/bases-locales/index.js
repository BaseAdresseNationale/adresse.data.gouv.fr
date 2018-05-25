import Section from '../section'

const BasesLocales = () => (
  <Section>
    <div className='row'>
      <div className='prose'>
        <h2>Bases Adresse Locales</h2>
      </div>
    </div>
    <style jsx>{`
      .row {
        display: flex;
      }

      .prose {
        font-size: 1.1em;
      }

      .prose ul {
        list-style: circle;
      }
      `}</style>
  </Section>
)

export default BasesLocales
