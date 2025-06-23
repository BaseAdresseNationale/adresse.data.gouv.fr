'use client'

import Section from '@/components/Section'
import { useEffect, useState } from 'react'
import { validate, profiles, ValidateType, PrevalidateType, ParseFileType } from '@ban-team/validateur-bal'
import SelectInput from '@/components/SelectInput'
import Loader from '@/components/Loader'
import ValidationReport from '@/components/ValidateurBAL/ValidationReport'
import ProfileDocumentation from '@/components/ValidateurBAL/ProfileDocumentation'
import DropZoneInput from '../DropZoneInput'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Button from '@codegouvfr/react-dsfr/Button'
import { useSearchParams } from 'next/navigation'
import { env } from 'next-runtime-env'

const availableProfiles = ['1.3', '1.4']

const profilesOptions: {
  label: string
  value: string
}[] = Object.values(profiles)
  .filter(({ code }) => availableProfiles.includes(code))
  .map(({ name, code }) => ({ label: name, value: code }))

export default function ValidateurBAL() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [validationReport, setValidationReport] = useState<ParseFileType | ValidateType | null>(null)
  const [profile, setProfile] = useState<string>(availableProfiles[1])
  const [file, setFile] = useState<File | null>(null)

  const handleReset = () => {
    setValidationReport(null)
  }

  const getReport = async (file: File, profile: string) => {
    try {
      setIsLoading(true)
      const report: ParseFileType | ValidateType = await validate(file as any, { profile })
      setValidationReport(report)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (value?: File) => {
    if (!value) {
      throw new Error('No file selected')
    }
    setFile(value)
    getReport(value, profile)
  }

  const handleProfileChange = async (value?: string) => {
    if (!value) {
      throw new Error('No profile selected')
    }
    setProfile(value)
    getReport(file as File, value)
  }

  useEffect(() => {
    const loadFile = async () => {
      try {
        const fileUrl = searchParams?.get('file')
        if (!fileUrl) {
          return
        }
        const options: RequestInit = {
          mode: 'cors',
          method: 'GET',
        }
        const fileBuffer = await fetch(fileUrl, options).then(res => res.arrayBuffer())
        const file = new File([fileBuffer], 'file.csv', { type: 'text/csv' })
        await handleFileChange(file)
      }
      catch (e) {
        console.error(e)
      }
    }

    loadFile()
  }, [])

  return (
    <>
      <Section pageTitle="Validateur BAL">
        {isLoading
          ? <Loader />
          : (validationReport && profile && file)
              ? (
                  <>
                    <div style={{ marginLeft: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Button iconId="fr-icon-arrow-left-line" style={{ height: 'fit-content' }} onClick={handleReset}>Retour à la sélection du fichier</Button>
                      <div style={{ maxWidth: 400 }}>
                        <SelectInput
                          options={profilesOptions}
                          label="Version de la spécification"
                          value={profile}
                          defaultOption="Choisir une version de la spécification"
                          handleChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <ValidationReport file={file} report={validationReport} profile={profile} />
                  </>
                )
              : (
                  <DropZoneInput
                    onChange={handleFileChange}
                    label="Déposez ou cliquez ici pour uploader votre fichier BAL à valider"
                    hint="Taille maximale: 50 Mo. Format supporté : CSV"
                    accept={{ 'text/csv': [], 'application/vnd.ms-excel': [] }}
                    maxSize={50 * 1024 * 1024}
                  />
                )}
      </Section>
      <Section title="Documentation" theme="primary">
        <p>
          Le Validateur BAL vérifie qu&apos;un fichier soit conforme au format Base Adresse Locale.
        </p>
        <p>
          Il est utilisé pour s&apos;assurer avant la publication que toutes les adresses d&apos;une BAL remonteront correctement dans la Base Adresse Nationale.
        </p>
        <p>
          Il existe deux profils sur le validateur :
        </p>
        <ul>
          <li>
            BAL 1.3 est le profil par défaut. Il assure une conformité complète avec la spécification de l&apos;AITF.
          </li>
          <li>
            BAL 1.4 est un profil qui intégre les identifiants uniques de la BAN.
          </li>
        </ul>
        <p>
          Si le fichier est invalide, le validateur BAL affiche un rapport en deux parties.
        </p>
        <p>
          Tout d&apos;abord une <b>validation générale</b> sur tout le fichier qui renvoie les éléments suivants :
        </p>
        <ul>
          <li>
            Les erreurs sont bloquantes et entraînent un rejet du fichier BAL. Il sera considéré comme non valide.
          </li>
          <li>
            Les alertes n&apos;empêchent pas la publication et le fichier BAL sera donc accepté, mais ces dernières peuvent être corrigées pour une meilleure intégrité des données.
          </li>
        </ul>
        <p>
          Puis une <b>validation ligne par ligne</b> qui renvoie les éléments suivants :
        </p>
        <ul>
          <li>
            Les erreurs sont bloquantes et entraînent un rejet de l&apos;ligne concernée. La BAL publiée sera alors incomplète.
          </li>
          <li>
            Les alertes n&apos;empêchent pas la publication et l&apos;ligne sera donc acceptée, mais les informations rattachées à l&apos;adresse seront dégradées.
          </li>
        </ul>
        <p>
          Voici le détail des erreurs et avertissements que vous pouvez rencontrer lors de la validation de votre fichier BAL suivant la spécification choisie :
        </p>
        {availableProfiles.map(profile => <ProfileDocumentation key={profile} profile={profiles[profile]} />)}
      </Section>
      <Section>
        <Alert title="Télécharger le validateur" severity="info" description={<p> Pour une utilisation avancée, vous pouvez télécharger le validateur sur cette <a href="https://github.com/BaseAdresseNationale/validateur-bal/releases" target="_blank" rel="noreferrer">page</a>.</p>} />
      </Section>
    </>
  )
}
