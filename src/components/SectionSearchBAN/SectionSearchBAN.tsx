'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { SearchBar } from '@codegouvfr/react-dsfr/SearchBar'

import Section from '@/components/Section'

import {
  Wrapper,
  FormWrapper,
  FormWrapperFooter,
  IntroWrapper,
  Title,
  FormDescription,
} from './SectionSearchBAN.styles'

interface InputSearchBANProps {
  id?: string
}

function InputSearch() {
  const [search, onSearchChange] = useState('')
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null)

  return (
    <>
      <SearchBar
        renderInput={({ className, id, placeholder, type }) => (
          <input
            ref={setInputElement}
            className={className}
            id={id}
            placeholder={placeholder}
            type={type}
            value={search}
            onChange={event => onSearchChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && inputElement !== null) {
                inputElement.blur()
              }
            }}
          />
        )}
      />
      {/*
        -> Sample of search results :
        <p>Search results for: {search}</p>
      */}
    </>

  )
}

function SectionSearchBAN({ id }: InputSearchBANProps) {
  return (
    <Section id={id}>
      <Wrapper>
        <IntroWrapper>
          <Title>Votre adresse est elle bien renseignée ?</Title>
          <Image src="./img/map.svg" alt="picto map" width={141} height={140} />
        </IntroWrapper>
        <FormWrapper>
          <Title>Recherchez dans la base adresse nationale</Title>
          <FormDescription>Saisissez votre adresse, une voie, un lieu-dit ou une commune</FormDescription>
          <InputSearch />
          <FormWrapperFooter>
            <a className="fr-link fr-link--icon-left fr-icon-road-map-line" href="#">Consulter directement la carte</a>
            <a className="fr-link fr-link--icon-left fr-icon-questionnaire-line" href="#">J’ai un soucis avec mon adresse, pourquoi ?</a>
          </FormWrapperFooter>
        </FormWrapper>
      </Wrapper>
    </Section>
  )
}

SectionSearchBAN.propTypes = {}

export default SectionSearchBAN
