import Section from './section'

const Contrib = () => (
  <Section>
    <div className='row'>
      <div>
        <h2>Guichet Adresse pour les organismes publics</h2>
        <p>Développé conjointement par l’IGN et La Poste, cet outil est destiné plus particulièrement aux mairies ainsi qu’à certains services territoriaux comme les SDIS.</p>
        <a href='https://guichet-adresse.ign.fr/login'><img src='/static/images/guichet-201605.png' alt='guichet adresse' /></a>
      </div>
    </div>
    <style jsx>{`
      .row {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
      }

      .row img {
        width: 100%;
      }

      @media (min-width: 900px) {
        .row > div {
          width: 48%;
        }
      }
    `}</style>
  </Section>
)

export default Contrib
