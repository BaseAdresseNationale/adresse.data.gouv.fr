import {useState} from 'react'
import {Users} from 'react-feather'
import AppCard from '../../components/donnees-nationales/app-card.js'
import appsData from '../../data/partners/usecases-ban.json'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'

function BaseUsages() {
  const [categorieFilter, setCategorieFilter] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const title = 'Liste des usages de la BAN'
  const description = 'Fichiers nationaux contenant les adresses du territoire.'

  const [searchTerm, setSearchTerm] = useState('')

  const filteredApps = appsData.filter(app =>
    (categorieFilter === '' || app.categorie_application === categorieFilter)
    && (statutFilter === '' || app.statut_integration === statutFilter)
    && (typeFilter === '' || app.type_integration === typeFilter)
    && (searchTerm === ''
      || (app.nom_application && app.nom_application.toLowerCase().includes(searchTerm.toLowerCase()))
      || (app.description_utilisation && app.description_utilisation.toLowerCase().includes(searchTerm.toLowerCase()))
      // eslint-disable-next-line no-mixed-operators
      || app.tags_application && app.tags_application.split(', ').some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  )

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Users size={56} alt='' aria-hidden='true' />} />
      <Section title='Une donnée d’intérêt général' background='grey'>
        <SectionText>
          L’adresse est une donnée d’intérêt général, son utilisation est un enjeu dans de nombreux domaines :<br />services publics, services de sécurité et de secours, gestionnaires de réseaux, services de livraison, de localisation et navigation, services clients et geomarketing , assurances…
        </SectionText>
      </Section>
      <div className='container'>
        <div className='filters'>
          <select onChange={e => setCategorieFilter(e.target.value)}>
            <option value=''>Toutes les catégories</option>
            {[...new Set(appsData.map(app => app.categorie_application))].map(categorie => (
              <option key={categorie} value={categorie}>{categorie}</option>
            ))}
          </select>
          <select onChange={e => setStatutFilter(e.target.value)}>
            <option value=''>Tous les statuts</option>
            {[...new Set(appsData.map(app => app.statut_integration))].map(statut => (
              <option key={statut} value={statut}>{statut}</option>
            ))}
          </select>
          <select onChange={e => setTypeFilter(e.target.value)}>
            <option value=''>Tous les modes</option>
            {[...new Set(appsData.map(app => app.type_integration))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='cards'>
          {filteredApps.map(app => <AppCard key={app.id_application} data={app} />)}
        </div>
        <style jsx>{`
        .container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem;
        }
        .filters {
          display: flex;
          justify-content: start;
          gap: 1rem;  // This creates the horizontal space between the filters
          margin-bottom: 2rem;  // Adds some vertical space before cards
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

      `}</style>
      </div>
    </Page>
  )
}

export default BaseUsages
