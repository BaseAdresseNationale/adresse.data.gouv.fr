'use client'

import React, { useState, useMemo } from 'react'
import { camelCase } from 'lodash'
import Section from '@/components/Section'
import appsDataSource from '@/data/partners/usecases-ban.json'
import Button from '@codegouvfr/react-dsfr/Button'
import { Select } from '@codegouvfr/react-dsfr/Select'
import Breadcrumb from '@/layouts/Breadcrumb'
import AppCard from './components/app-card'
import { Filters } from './page.styles'
import CardWrapper from '@/components/CardWrapper'
import Input from '@codegouvfr/react-dsfr/Input'
import { CenteredLink } from './page.styles'
const sortByKey = (key: string) => (a: Record<string, string>, b: Record<string, string>) => ((a[key] < b[key]) && -1) || ((a[key] > b[key]) && 1) || 0

const appsData = appsDataSource.map(
  appData => Object.fromEntries(
    Object
      .entries(appData)
      .filter(([key]) => key)
      .map(([key, value]) => [camelCase(key), value])
  )
)
const filterCategories = [...new Set(appsData.map(({ categorieApplication }) => categorieApplication))]
const filterStatuts = [...new Set(appsData.map(({ statutIntegration }) => statutIntegration))]
const filterTypes = [...new Set(appsData.map(({ typeIntegration }) => typeIntegration))]

export default function BaseUsages() {
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
  }) => (
    (categorieFilter === '' || categorieApplication === categorieFilter)
    && (statutFilter === '' || statutIntegration === statutFilter)
    && (typeFilter === '' || typeIntegration === typeFilter)
    && (searchTerm === '' || (
      (nomApplication && nomApplication.toLowerCase().includes(searchTerm.toLowerCase()))
      || (descriptionUtilisation && descriptionUtilisation.toLowerCase().includes(searchTerm.toLowerCase()))
      || (tagsApplication && tagsApplication.split(', ').some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    )
  )
  ).sort(sortByKey('nomApplication')), [categorieFilter, statutFilter, typeFilter, searchTerm])
  return (
    <>
      <Breadcrumb
        currentPageLabel="Nos usagers"
        segments={[]}
      />
      <Section pageTitle="Une donnée d’intérêt général">
        <p>
          L’adresse est une donnée d’intérêt général, son utilisation est un enjeu dans de nombreux domaines :<br />
          services publics, services de sécurité et de secours, gestionnaires de réseaux, services de livraison et navigation ...<br /><br />
          Les organismes partenaires (entreprises, administrations, etc) référencés sur cette page reconnaissent la BAN comme source de référence officielle pour les adresses en France en application de la Loi 3DS. Ils travaillent activement à l’utilisation des adresses BAN dans leur processus.<br /><br />
          Note : les opérations d’exploitation et les choix techniques des opérateurs peuvent induire des sélections et des délais de prise en compte des nouvelles adresses, qui peuvent aller jusqu’à plusieurs mois.
        </p>
      </Section>
      <Section>
        <Filters>
          <Select
            label="Catégories"
            nativeSelectProps={{
              onChange: e => setCategorieFilter(e.target.value),
            }}
          >
            <option value="">Toutes les catégories</option>
            {filterCategories.map((categorie, index) => (<option key={index} value={categorie}>{categorie}</option>))}
          </Select>
          <Select
            label="Status"
            nativeSelectProps={{
              onChange: e => setStatutFilter(e.target.value),
            }}
          >
            <option value="">Tous les statuts</option>
            {filterStatuts.map((statut, index) => (<option key={index} value={statut}>{statut}</option>))}
          </Select>
          <Select
            label="Modes"
            nativeSelectProps={{
              onChange: e => setStatutFilter(e.target.value),
            }}
          >
            <option value="">Tous les modes</option>
            {filterTypes.map((type, index) => (<option key={index} value={type}>{type}</option>))}
          </Select>
          <Input
            label="Rechercher"
            iconId="fr-icon-user-search-line"
            nativeInputProps={{
              placeholder: 'Rechercher...',
              type: 'text',
              onChange: e => setSearchTerm(e.target.value),
              value: searchTerm,
            }}
            className="filter-search"
          />
        </Filters>
        <CardWrapper isSmallCard>
          {filteredApps.map((appDescription, index) => appDescription && (
            <AppCard
              key={index}
              statutIntegration={appDescription.statutIntegration}
              typeIntegration={appDescription.typeIntegration}
              nomApplication={appDescription.nomApplication}
              descriptionUtilisation={appDescription.descriptionUtilisation}
              imageUtilisateur={appDescription.imageUtilisateur}
              urlApplication={appDescription.urlApplication}
              dernierTelechargement={appDescription.dernierTelechargement}
              nomUtilisateur={appDescription.nomUtilisateur}
              tagsApplication={appDescription.tagsApplication}
            />
          ))}
        </CardWrapper>
        <Section title="Vous utilisez la Base Adresse Nationale ?">
          <p>Faites nous part de votre usage et faites apparaître votre application sur cette page</p>
          <CenteredLink>
            <Button
              linkProps={{
                href: 'mailto:adresse@data.gouv.fr?subject=Ajout d’un cas d’usage - Base Adresse Nationale',
                target: '_blank',
              }}
            >
              Ajoutez votre application
            </Button>
          </CenteredLink>
        </Section>
      </Section>
    </>
  )
}
