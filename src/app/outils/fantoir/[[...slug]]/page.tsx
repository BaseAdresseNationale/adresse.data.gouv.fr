'use client'

import { useState, useMemo, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { env } from 'next-runtime-env'
import { sortBy, debounce, pick } from 'lodash'
import { Download } from '@codegouvfr/react-dsfr/Download'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Input } from '@codegouvfr/react-dsfr/Input'

import { getFantoir, getVoiesFantoir } from '@/lib/api-ban'
import { getDepartements, getDepartementByCode } from '@/lib/api-geo'
import Section from '@/components/Section'

import HeaderListFantoir from '../components/HeaderListFantoir'
import BodyListFantoir from '../components/BodyListFantoir'
import VoieInformation from '../components/VoieInformation'
import NoResult from '../components/NoResult'
import BreadcrumbFantoir from '../components/BreadcrumbFantoir'

import {
  ContentWrapper,
  Search,
  CsvLink,
} from './page.styles'

import type { Departement } from '@/types/api-geo.types'
import type {
  BANCommune as Commune,
  BANVoie as Voie,
} from '@/types/api-ban.types'

type ViewType = 'departement' | 'commune' | 'voie'
interface ViewTypeConfig {
  searchLabel: string
  searchHandler: (search: string) => void
  sectionTitle: string
  dataHeaders: string[]
  dataInfos?: string[]
}

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

const viewTypeConfigKeys: ViewType[] = ['departement', 'commune', 'voie']

function FantoirAppPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = use(props.params);

  const {
    slug = []
  } = params;

  const [defaultDepartements, setDefaultDepartements] = useState<Departement[]>([])
  const [departements, setDepartements] = useState<Departement[]>([])
  const [nomDepartement, setNomDepartement] = useState<string>('')
  const [defaultCommunes, setDefaultCommunes] = useState<Commune[]>([])
  const [communes, setCommunes] = useState<Commune[]>([])
  const [nomCommune, setNomCommune] = useState<string>('')
  const [defaultVoies, setDefaultVoies] = useState<Voie[]>([])
  const [voies, setVoies] = useState<Voie[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const [departement, codeCommune] = slug
  const viewType: ViewType = (viewTypeConfigKeys[slug?.length])

  useEffect(() => {
    let loadingDelayed: NodeJS.Timeout
    const fetchDepartements = async () => {
      setIsLoading(true)
      const departements = await getDepartements()
      const defaultDepartments = sortBy(departements, ['code'])
      setDepartements(defaultDepartments)
      setDefaultDepartements(defaultDepartments)
      loadingDelayed = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(loadingDelayed)
    }
    fetchDepartements()
  }, [])

  useEffect(() => {
    let loadingDelayed: NodeJS.Timeout
    const fetchCommunes = async (departement: string) => {
      setIsLoading(true)
      const departementInfos = await getDepartementByCode(departement)
      setNomDepartement(departementInfos.nom)

      const communes: Commune[] = (await getFantoir(departement)) || []
      const defaultCommunes = sortBy(communes, ['id'])
      setDefaultCommunes(defaultCommunes)
      setCommunes(defaultCommunes)
      loadingDelayed = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(loadingDelayed)
    }
    if (departement) fetchCommunes(departement)
  }, [departement])

  useEffect(() => {
    let loadingDelayed: NodeJS.Timeout
    const fetchVoies = async (communes: Commune[], codeCommune: string) => {
      setIsLoading(true)
      const { nomCommune }
        = (
          communes.find((commune: Commune) => commune.codeCommune === codeCommune)
          || {}
        ) as Commune
      setNomCommune(nomCommune)

      const voies = (await getVoiesFantoir(codeCommune)) || []
      const defaultVoies = sortBy(voies, ['id'])
      setDefaultVoies(defaultVoies)
      setVoies(defaultVoies)
      loadingDelayed = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(loadingDelayed)
    }
    if (communes && codeCommune) fetchVoies(communes, codeCommune)
  }, [codeCommune, communes])

  const viewTypeConfig: Record<ViewType, ViewTypeConfig> = useMemo(() => {
    const searchDepartement = debounce((value) => {
      const filtredDepartement = value
        ? defaultDepartements.filter(departement => departement.nom.toLowerCase().includes(value.toLowerCase()))
        : defaultDepartements
      setDepartements(filtredDepartement)
    }, 300)

    const searchCommunes = debounce((search) => {
      const FiltredCommunes = search
        ? defaultCommunes.filter(commune => commune.nomCommune.toLowerCase().includes(search.toLowerCase()))
        : defaultCommunes

      setCommunes(FiltredCommunes)
    }, 300)

    const searchVoies = debounce((search) => {
      const filtredVoie = search
        ? defaultVoies.filter(voie => voie.libelleVoieComplet.toLowerCase().includes(search.toLowerCase()))
        : defaultVoies

      setVoies(filtredVoie)
    }, 300)

    return {
      departement: {
        searchLabel: 'Chercher un département',
        searchHandler: searchDepartement,
        sectionTitle: 'Liste des départements',
        dataHeaders: ['Département', 'Code département'],
        dataInfos: ['nom', 'code'],
      },
      commune: {
        searchLabel: 'Chercher une commune',
        searchHandler: searchCommunes,
        sectionTitle: nomDepartement ? `Liste des communes - ${nomDepartement}` : 'Liste des communes',
        dataHeaders: ['Commune', 'Code INSEE', 'Annulée ?'],
        dataInfos: ['nomCommune', 'codeCommune', 'dateAnnulation'],
      },
      voie: {
        searchLabel: 'Chercher une voie',
        searchHandler: searchVoies,
        sectionTitle: nomCommune ? `Liste des voies - ${nomCommune}` : 'Liste des voies',
        dataHeaders: ['Nom de la voie', 'type', 'Code FANTOIR'],
      },
    }
  }, [nomDepartement, nomCommune, defaultDepartements, defaultCommunes, defaultVoies])

  return (
    <>
      <Section>
        <BreadcrumbFantoir
          rootPath="/outils/fantoir"
          nomDepartement={nomDepartement}
          codeDepartement={departement}
          nomCommune={nomCommune}
          codeCommune={codeCommune}
        />

        <Alert
          severity="warning"
          title="Outil déprécié"
          description={(
            <>
              <b>Attention : </b>La dernière mise à jour de l’Explorateur Fantoir intègre les données de commune de 2022
              et n’est plus maintenue.<br />
              De plus, depuis juillet 2023, le fichier TOPO, toujours produit par la DGFIP,
              se substitue au fichier FANTOIR.<br />
              Pour accéder aux données les plus récentes, nous vous invitons à
              consulter les données TOPO depuis{' '}
              <Link href="https://www.data.economie.gouv.fr/explore/dataset/topo-fichier-des-entites-topographiques/information/" target="_blank">
                data.economie.gouv.fr (site des données du ”Ministère de l’Économie, des Finances et de l’Industrie”)
              </Link>.
            </>
          )}
        />

      </Section>

      <Section pageTitle="Explorateur Fantoir">
        <p>
          L’explorateur Fantoir permet, en quelques clics, de consulter la base FANTOIR
          de la Direction générale des finances publiques (DGFIP).<br />
          Cette Base FANTOIR (pour <i>Fichier ANnuaire TOpographique Initialisé Réduit</i>) répertorie,
          pour chaque commune, le nom des lieux-dits et des voies. Y compris celles situées dans les
          lotissements et les copropriétés.
        </p>
      </Section>

      <Section title={viewTypeConfig[viewType].sectionTitle}>
        {viewType === 'voie' && codeCommune && (
          <CsvLink>
            <Download
              details="JPG – 61,88 ko"
              label="Télécharger la liste des voies au format CSV"
              linkProps={{
                href: `${NEXT_PUBLIC_API_BAN_URL}/api-fantoir/communes/${codeCommune}/voies.csv`,
              }}
            />
          </CsvLink>
        )}

        <Search>
          <Input
            // label={viewTypeConfig[viewType].searchLabel}
            iconId="fr-icon-search-line"
            nativeInputProps={{
              type: 'search',
              placeholder: viewTypeConfig[viewType].searchLabel,
              onChange: (evt: React.ChangeEvent<HTMLInputElement>) => viewTypeConfig[viewType].searchHandler(evt.target.value),
            }}
            // onButtonClick={search => viewTypeConfig[viewType].searchHandler(search)}
            state="default"
            label={null}
          />
        </Search>

        <ContentWrapper>
          <HeaderListFantoir
            headers={viewTypeConfig[viewType].dataHeaders}
          />

          {/* fantoir */}
          {viewType === 'departement' && (
            departements.length > 0
              ? (
                  departements.map((departement) => {
                    const formatedDepartement = pick(departement, ...(viewTypeConfig.departement.dataInfos || []))

                    return (
                      <BodyListFantoir
                        key={departement.code}
                        contents={Object.values(formatedDepartement)}
                        onSelect={() => router.push(`fantoir/${departement.code}`)}
                      />
                    )
                  })
                )
              : (<NoResult isLoading={isLoading} />)
          )}

          {/* fantoir/{department} */}
          {viewType === 'commune' && (
            communes.length > 0
              ? (
                  communes.map((commune: Commune) => {
                    const formatedCommune = pick(commune, ...(viewTypeConfig.commune.dataInfos || []))

                    if (!formatedCommune.dateAnnulation) {
                      formatedCommune.dateAnnulation = 'non'
                    }

                    return (
                      <BodyListFantoir
                        key={commune.id}
                        contents={Object.values(formatedCommune).map(entry => entry?.toString() || '')}
                        isCanceled={Boolean(formatedCommune.dateAnnulation && formatedCommune.dateAnnulation !== 'non')}
                        onSelect={() => router.push(`${commune.codeDepartement}/${commune.codeCommune}`)}
                      />
                    )
                  })
                )
              : (<NoResult isLoading={isLoading} />)
          )}

          {/* fantoir/{department}/{codeCommune} */}
          {viewType === 'voie' && (
            voies.length > 0
              ? (
                  voies.map(voie => (
                    <VoieInformation
                      key={voie.id}
                      voie={voie}
                    />
                  ))
                )
              : (<NoResult isLoading={isLoading} />)
          )}
        </ContentWrapper>
      </Section>
    </>
  )
}

export default FantoirAppPage
