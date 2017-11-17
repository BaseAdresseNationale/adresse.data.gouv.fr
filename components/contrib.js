import Section from './section'
import Head from './head'

const Contrib = () => (
  <div>
    <Head title='Contribuer' icon='/static/images/icons/contribute.svg'>
      <div>
        <p>Les différents outils à votre disposition pour contribuer au contenu de la BAN.</p>
      </div>
    </Head>
    <Section>
      <div className='row'>
        <div>
          <h2>Guichet Adresse pour les organismes publics</h2>
          <p>Développé conjointement par l’IGN et La Poste, cet outil est destiné plus particulièrement aux mairies ainsi qu’à certains services territoriaux comme les SDIS.</p>
          <a href='https://guichet-adresse.ign.fr/login'><img src='/static/images/guichet-201605.png' alt='guichet adresse' /></a>
        </div>
      </div>
    </Section>
    <style jsx>{`
      .row {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
      }

      .row img {
        max-width: 450px;
        margin: 0 50px;
      }

      @media (min-width: 900px) {
        .row > div {
          width: 48%;
        }
      }
      `}</style>
  </div>
)

export default Contrib
