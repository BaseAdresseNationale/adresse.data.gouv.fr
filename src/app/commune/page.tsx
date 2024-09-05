'use client'

import CommuneInput from '@/components/CommuneInput'
import Section from '@/components/Section'
import { useRouter } from 'next/navigation'

export default function VotreCommuneEtSaBALPage() {
  const router = useRouter()

  return (
    <>
      <Section pageTitle="Consulter la page commune">
        <div style={{ maxWidth: 600 }}>
          <CommuneInput placeholder="Nom ou code INSEE, exemple : 64256 ou Hasparren" label="Rechercher une commune" onChange={commune => commune && router.push(`/commune/${commune.code}`)} />
        </div>
      </Section>
      <Section title="Pourquoi">
        <p style={{ marginBottom: 0 }}>
          Améliorer l’accès des secours, des colis, l’arrivée de fibre, la complétude des GPS … autant de raisons de recenser l’ensemble des adresses de son territoire et de les mettre à disposition de tous les utilisateurs dans la Base Adresse Nationale, la base de référence des adresses en France.
        </p>
      </Section>
      <Section title="Processus global ? (trouver un prestataire)">
        <p style={{ marginBottom: 0 }}>
          Les communes, compétentes sur leur adressage, publient sous leur responsabilité leur Base Adresse Locale, recensant l’intégralité de leurs adresses.
        </p>
      </Section>
      <Section title="Comment ?">
        <p>
          Plusieurs outils sont à disposition :
        </p>
        <ul>
          <li>
            Commencer sa BAL sur l’outil national en ligne gratuit <a href="https://mes-adresses.data.gouv.fr/" className="fr-link">Mes Adresses</a>
          </li>
          <li>
            Constituer un fichier csv au format BAL et le déposer sur :
            <ul>
              <li>
                le site <a href="https://www.data.gouv.fr/fr/" className="fr-link">data.gouv.fr</a>
              </li>
              <li>
                {/* TODO : lien vers le formulaire de dépôt */}
                le <a href="#" className="fr-link">formulaire de dépôt</a>
              </li>
            </ul>
          </li>
          <li>
            Brancher directement son outil propre via l’<a href="https://github.com/BaseAdresseNationale/api-depot/wiki/Documentation" className="fr-link">API de dépôt</a> de BAL
          </li>
        </ul>
      </Section>
    </>
  )
}
