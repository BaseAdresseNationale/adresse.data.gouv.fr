import Page from '../layouts/main'
import Hero from '../components/hero'

import Pitch from '../components/home/pitch'
import Subscribe from '../components/home/subscribe'

export default () => (
  <Page>
    <Hero
      title='Données Adresse Ouverte'
      tagline='Un référentiel national ouvert : de l’adresse à la coordonnée géographique' />

    <Pitch />
    <Subscribe />
  </Page>
)
