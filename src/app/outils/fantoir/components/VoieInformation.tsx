'use client'

import { useState } from 'react'

import ActionButtonLine from './ActionButtonLine'
import {
  StyledLine,
  StyledInfos,
} from './components.styles'
import {
  StyledVoieTags,
  StyledVoieTag,
} from './VoieInformation.styles'

import type { BANVoie } from '@/types/api-ban.types'

const ChevronUp = () => <span className="fr-icon-arrow-up-s-fill" aria-hidden="true"></span>
const ChevronDown = () => <span className="fr-icon-arrow-down-s-fill" aria-hidden="true"></span>

interface VoieInformationProps {
  voie: BANVoie
}

function VoieInformation({ voie }: VoieInformationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="line-container">
      <ActionButtonLine
        label={`${isOpen ? 'Masquer' : 'Afficher'} les informations concernant la voie ${voie.libelleVoieComplet}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StyledLine $isOpen={isOpen} $isCanceled={Boolean(voie?.dateAnnulation)}>
          <StyledInfos>{voie.libelleVoieComplet}</StyledInfos>
          <StyledInfos>{voie.typeVoie}</StyledInfos>
          <StyledInfos>{voie.codeRivoli}</StyledInfos>
          <div>
            {isOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
          </div>
        </StyledLine>
      </ActionButtonLine>

      {isOpen && (
        <StyledVoieTags>
          <StyledVoieTag>Code Rivoli : <span>{voie.codeRivoli}</span></StyledVoieTag>
          <StyledVoieTag>Date d’ajout : <span>{voie.dateAjout}</span></StyledVoieTag>
          {voie.natureVoie && (
            <StyledVoieTag>Nature de la voie : <span>{voie.natureVoie}</span></StyledVoieTag>
          )}
          <StyledVoieTag>Voie privée : <span>{voie.voiePrivee ? 'oui' : 'non'}</span></StyledVoieTag>
          {voie?.dateAnnulation && (
            <StyledVoieTag $isCanceled>Date d’annulation : <span>{voie.dateAnnulation}</span></StyledVoieTag>
          )}
        </StyledVoieTags>
      )}
    </div>
  )
}

export default VoieInformation
