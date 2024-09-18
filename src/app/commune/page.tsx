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
      <Section title="Qu'est ce que la page commune ?">
        <p style={{ marginBottom: 0 }}>
          La page commune permet de consulter les informations relatives à l&apos;état de l&apos;adressage de chaque commune.
        </p>
        <p>
          Vous pourrez y retrouver les informations suivantes :
        </p>
        <ul>
          <li>
            Le nombre total d&apos;adresses de la commune
          </li>
          <li>
            Le nombre d&apos;adresses certifiées
          </li>
          <li>
            Le mode de publication des adresses
          </li>
          <li>
            Les fichiers contenant les adresses de la commune au format CSV
          </li>
        </ul>
      </Section>
    </>
  )
}
