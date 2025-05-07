'use client'

import React from 'react'
import styled from 'styled-components'
import Section from '@/components/Section'

export const CodeWrapper = styled.code`
  background-color: #eee;
  border-radius: 3px;
  font-family: courier, monospace;
  padding: 0 3px;
`
export default function MiseEnFormeDocumentation() {
  return (
    <Section title="Documentation" theme="primary">
      <h5>
        Cette outil permet la mise en forme d&apos;un fichier BAL avec ces deux fonctionnalités :
      </h5>
      <h5>Peut générer des valeurs par défaut pour certains champs manquants</h5>
      <ul>
        <li><b>id_ban_commune</b> : uuid proposé par la BAN</li>
        <li><b>id_ban_toponyme</b> : uuid généré aleatoirement (identique pour les lignes avec la même voies)</li>
        <li><b>id_ban_toponyme</b> : uuid généré aleatoirement (identique pour les numeros avec plusierus positions)</li>
        <li><b>commune_insee</b> : rempli si il est présent dans la <CodeWrapper>cle_interop</CodeWrapper></li>
        <li><b>commune_nom</b> : généré a partir du <CodeWrapper>commune_insee</CodeWrapper></li>
        <li><b>date_der_maj</b> : rempli avec la date du jour</li>
      </ul>
      <br />
      <h5>Peut remédier certaines valeurs de champs existants qui ne sont pas optimales :</h5>
      <ul>
        <li><b>date_der_maj</b> : met la date au bon format <CodeWrapper>yyyy-MM-dd</CodeWrapper> si elle est reconnue</li>
      </ul>
    </Section>
  )
}
