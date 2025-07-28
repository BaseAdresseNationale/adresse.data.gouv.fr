'use client'

import React from 'react'
import styled from 'styled-components'
import Section from '@/components/Section'
import Alert from '@codegouvfr/react-dsfr/Alert'

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
        Cet outil permet la mise en forme d&apos;un fichier BAL avec ces deux fonctionnalités
      </h5>
      <h5>Peut générer des valeurs par défaut pour certains champs manquants : </h5>
      <ul>
        <li><CodeWrapper>id_ban_commune</CodeWrapper> <b>uuid</b> proposé par la route district de la BAN (ex : <a href="https://plateforme.adresse.data.gouv.fr/api/district/cog/12218" target="_blank">https://plateforme.adresse.data.gouv.fr/api/district/cog/12218</a>)</li>
        <li><CodeWrapper>id_ban_toponyme</CodeWrapper> <b>uuid</b> généré aléatoirement (identique pour les lignes avec la même <CodeWrapper>voie_nom</CodeWrapper>)</li>
        <li><CodeWrapper>id_ban_adresse</CodeWrapper> <b>uuid</b> généré aléatoirement (identique pour les numéros avec plusieurs positions)</li>
      </ul>
      <Alert
        severity="info"
        closable={false}
        small={false}
        title="Génération des identifiants BAN"
        description={(
          <>
            <p>La mise en forme permet donc de générer les identifiants BAN.</p>
            <p>Elle permet également de les maintenir à jour (ex: si vous rajoutez une ligne avec le même <CodeWrapper>voie_nom</CodeWrapper>, l&apos;identifiant <CodeWrapper>id_ban_toponyme</CodeWrapper> sera le même pour les deux lignes)</p>
          </>
        )}
      />
      <ul>
        <li><CodeWrapper>commune_insee</CodeWrapper> rempli s&apos;il est présent dans la <CodeWrapper>cle_interop</CodeWrapper></li>
        <li><CodeWrapper>commune_nom</CodeWrapper> rempli à partir du <CodeWrapper>commune_insee</CodeWrapper> (même si calculé)</li>
        <li><CodeWrapper>date_der_maj</CodeWrapper> rempli avec la date du jour</li>
      </ul>
      <br />
      <h5>Peut améliorer certaines valeurs de champs existants qui ne sont pas optimales :</h5>
      <ul>
        <li><CodeWrapper>date_der_maj</CodeWrapper> transforme la date au bon format <CodeWrapper>yyyy-MM-dd</CodeWrapper> si elle est reconnue</li>
      </ul>
    </Section>
  )
}
