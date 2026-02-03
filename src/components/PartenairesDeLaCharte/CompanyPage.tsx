'use client'

import CandidacyModal from '@/components/PartenairesDeLaCharte/CandidacyModal'
import SearchPartenaire from '@/components/PartenairesDeLaCharte/SearchPartenaire'
import Section from '@/components/Section'
import { PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType } from '@/types/partenaire.types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { useCallback, useEffect, useState } from 'react'
import ReviewForm from './ReviewForm'
import { Departement } from '@/types/api-geo.types'

const PARTENAIRE_SEARCH_FILTER = {
  type: PartenaireDeLaCharteTypeEnum.ENTREPRISE,
}

const Modal = createModal({
  id: 'company-review-modal',
  isOpenedByDefault: false,
})

interface CompanyPageProps {
  services: Record<string, number>
  departements: Departement[]
  page: number
}

export default function CompanyPage({
  departements,
  services,
  page,
}: CompanyPageProps) {
  const [reviewedPartenaire, setReviewedPartenaire] = useState<PartenaireDeLaChartType>()
  const [partenairesLoaded, setPartenairesLoaded] = useState(false)

  useEffect(() => {
    if (!partenairesLoaded) return
    const elem = document.querySelector(`a[title="Page ${page}"]`)
    if (elem) {
      ;(elem as HTMLElement).click()
    }
  }, [partenairesLoaded, page])

  const handleStartReview = useCallback((partenaire: PartenaireDeLaChartType) => {
    setReviewedPartenaire(partenaire)
    Modal.open()
  }, [])

  const handlePartenairesLoaded = useCallback(() => {
    setPartenairesLoaded(true)
  }, [])

  const handleCloseModal = () => {
    setReviewedPartenaire(undefined)
    Modal.close()
  }
  return (
    <>
      <Section pageTitle="Annuaire des sociétés prestataires">
        <p>
          L’annuaire des sociétés prestataires recense les entreprises qui proposent des prestations aux communes pour la réalisation de leur Base Adresse locale. Ces organismes s’engagent à respecter le format Base Adresse Locale, sa gouvernance, et pour ces raisons sont identifiés comme tiers de confiance.
        </p>
        <p>
          Néanmoins, cela ne préjuge pas de la qualité du travail réalisé par ces sociétés, et nous invitons les communes à comparer la nature et le coût de ces prestations.
        </p>
        <p>
          En savoir plus sur le choix d&apos;un <a href="https://doc.adresse.data.gouv.fr/docs/documentation-generale/Mettre%20%C3%A0%20jour%20sa%20Base%20Adresse%20Locale/Les%20prestations%20pour%20la%20r%C3%A9alisation%20d%E2%80%99une%20Base%20Adresse%20Locale#%C3%A0-propos-des-prestations-" target="_blank">prestataire</a>.
        </p>
        <br />
        <p>
          Votre société réalise déjà des Bases Adresses Locales pour les communes ? Vous pouvez demander à intégrer cet annuaire en remplissant ce formulaire :
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
          <CandidacyModal defaultType={PartenaireDeLaCharteTypeEnum.ENTREPRISE} buttonLabel="Inscrivez-vous" services={Object.keys(services)} departements={departements} />
        </div>
        <SearchPartenaire
          placeholder="Rechercher une société"
          searchBy="name"
          departements={departements}
          filter={PARTENAIRE_SEARCH_FILTER}
          onReview={handleStartReview}
          onLoaded={handlePartenairesLoaded}
        />
      </Section>
      <Modal.Component title={`Notez votre expérience avec ${reviewedPartenaire?.name}`}>
        {reviewedPartenaire && <ReviewForm onClose={handleCloseModal} partenaire={reviewedPartenaire} />}
      </Modal.Component>
    </>
  )
}
