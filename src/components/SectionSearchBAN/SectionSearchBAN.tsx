'use client'

import { useContext } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Image from 'next/image'
import Link from 'next/link'

import BALWidgetContext from '@/contexts/BALWidget.context'
import Section from '@/components/Section'
import SearchBAN from '@/components/SearchBAN'
import {
  Wrapper,
  FormWrapper,
  FormWrapperFooter,
  IntroWrapper,
  Title,
  FormDescription,
  ButtonLink,
} from './SectionSearchBAN.styles'
import { env } from 'next-runtime-env'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

interface SectionSearchBANProps {
  id?: string
}

function SectionSearchBAN({ id }: SectionSearchBANProps) {
  const { open, navigate } = useContext(BALWidgetContext)

  const handleContactParticuliers = () => {
    navigate('/particulier')
    open()
  }

  return (
    <Section id={id}>
      <Wrapper>
        <IntroWrapper>
          <Title>Votre adresse est elle bien renseignée ?</Title>
          <Image src="./img/map.svg" alt="picto map" width={141} height={140} />
        </IntroWrapper>
        <FormWrapper>
          <SearchBAN>
            <Title>Rechercher dans la Base Adresse Nationale</Title>
            <FormDescription>Saisissez votre adresse, une voie, un lieu-dit ou une commune</FormDescription>
          </SearchBAN>
          <FormWrapperFooter>
            <Button
              iconId="fr-icon-road-map-line"
              linkProps={{
                href: '/carte-base-adresse-nationale',
              }}
            >
              Consulter directement la carte
            </Button>
            <Button
              iconId="fr-icon-questionnaire-line"
              onClick={handleContactParticuliers}
            >
              Vérifier mon adresse
            </Button>
          </FormWrapperFooter>
        </FormWrapper>
      </Wrapper>
    </Section>
  )
}

SectionSearchBAN.propTypes = {}

export default SectionSearchBAN
