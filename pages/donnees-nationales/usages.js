import {useState, useMemo} from 'react'
import {Users} from 'react-feather'
import camelCase from 'lodash/camelCase'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import AppCard from '@/components/donnees-nationales/app-card'
import ButtonLink from '@/components/button-link'

import appsDataSource from '@/data/partners/usecases-ban.json'

const sortByKey = key => (a, b) => ((a[key] < b[key]) && -1) || ((a[key] > b[key]) && 1) || 0

const appsData = appsDataSource.map(
  appData => Object.fromEntries(
    Object
      .entries(appData)
      .filter(([key]) => key)
      .map(([key, value]) => [camelCase(key), value])
  )
)

const filterCategories = [...new Set(appsData.map(({categorieApplication}) => categorieApplication))]
const filterStatuts = [...new Set(appsData.map(({statutIntegration}) => statutIntegration))]
const filterTypes = [...new Set(appsData.map(({typeIntegration}) => typeIntegration))]

function BaseUsages() {
  const [categorieFilter, setCategorieFilter] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredApps = useMemo(() => appsData.filter(({
    categorieApplication,
    statutIntegration,
    typeIntegration,
    nomApplication,
    descriptionUtilisation,
    tagsApplication,
  }) =>
    (categorieFilter === '' || categorieApplication === categorieFilter) &&
    (statutFilter === '' || statutIntegration === statutFilter) &&
    (typeFilter === '' || typeIntegration === typeFilter) &&
    (searchTerm === '' ||
      (
        (nomApplication && nomApplication.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (descriptionUtilisation && descriptionUtilisation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tagsApplication && tagsApplication.split(', ').some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    )
  ).sort(sortByKey('nomApplication')), [categorieFilter, statutFilter, typeFilter, searchTerm])

  const title = 'Liste des usages de la BAN'
  const description = 'Fichiers nationaux contenant les adresses du territoire.'

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
            {filterCategories.map(categorie => (<option key={categorie} value={categorie}>{categorie}</option>))}
          </select>
          <select onChange={e => setStatutFilter(e.target.value)}>
            <option value=''>Tous les statuts</option>
            {filterStatuts.map(statut => (<option key={statut} value={statut}>{statut}</option>))}
          </select>
          <select onChange={e => setTypeFilter(e.target.value)}>
            <option value=''>Tous les modes</option>
            {filterTypes.map(type => (<option key={type} value={type}>{type}</option>))}
          </select>
          <input
            type='text'
            placeholder='Rechercher...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='filter-search'
          />
        </div>

        <div className='cards'>
          {filteredApps.map(appDescription => <AppCard key={appDescription.idApplication} {...appDescription} />)}
        </div>
        <Section title='Vous utilisez la Base Adresse Nationale ?'>
          <SectionText>
            <p>Faites nous part de votre usage et faites apparaître votre application sur cette page</p>
          </SectionText>

          <div className='centered'>
            <ButtonLink
              href='mailto:adresse@data.gouv.fr?subject=Ajout d’un cas d’usage - Base Adresse Nationale'
              isExternal
            >
              Ajoutez votre application
            </ButtonLink>
          </div>
        </Section>

        <style jsx>{`
          .container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 2rem;
          }
          .filters {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            justify-content: start;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .filter-search {
            flex: 1;
            min-width: 15em;
          }
          .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          .centered {
              margin: 40px auto;
              display: flex;
              justify-content: center;
          }
        `}</style>
      </div>
    </Page>
  )
}

export default BaseUsages
