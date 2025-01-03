'use client'

import Section from '@/components/Section'
import { Stepper } from '@codegouvfr/react-dsfr/Stepper'
import { useState } from 'react'
import { validate, profiles as profilesMap } from '@ban-team/validateur-bal'
import SelectInput from '@/components/SelectInput'
import Loader from '@/components/Loader'
import ValidationReport from '@/components/ValidateurBAL/ValidationReport'
import ProfileDocumentation from '@/components/ValidateurBAL/ProfileDocumentation'
import DropZoneInput from '../DropZoneInput'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Button from '@codegouvfr/react-dsfr/Button'

const availableProfiles = ['1.3', '1.4']

const profilesOptions = Object.values(profilesMap)
  .filter(({ code }) => availableProfiles.includes(code))
  .map(({ name, code }) => ({ label: name, value: code }))

export default function ValidateurBAL() {
  const [stepIndex, setStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [validationReport, setValidationReport] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<string>('')

  const handleReset = () => {
    setStepIndex(0)
    setValidationReport(null)
    setFile(null)
    setProfile('')
  }

  const handleFileChange = (file?: File) => {
    if (!file) {
      throw new Error('No file selected')
    }
    setFile(file)
    setStepIndex(1)
  }

  const handleProfileChange = async (value: string) => {
    if (!file) {
      throw new Error('No file selected')
    }
    try {
      setIsLoading(true)
      setProfile(value)
      const report = await validate(file, value)
      setValidationReport(report)
      setStepIndex(2)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { title: 'Ajout du fichier à valider', content: (
      <DropZoneInput
        onChange={handleFileChange}
        label="Déposer ou cliquer ici pour télécharger votre fichier BAL à publier"
        hint="Taille maximale: 50 Mo. Format supporté : CSV"
        accept={{ 'text/csv': [] }}
        maxSize={50 * 1024 * 1024}
      />
    ) },
    { title: 'Choix du profil', content: <div style={{ maxWidth: 400 }}><SelectInput options={profilesOptions} label="Version de la spécification" value={profile} defaultOption="Choisir une version de la spécification" handleChange={handleProfileChange} /></div> },
  ]

  return (
    <>
      <Section pageTitle="Validateur BAL">
        {isLoading
          ? <Loader />
          : (validationReport && profile)
              ? (
                  <>
                    <div style={{ marginLeft: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Button iconId="fr-icon-arrow-left-line" style={{ height: 'fit-content' }} onClick={handleReset}>Retour à la sélection du fichier</Button>
                      {steps[1].content}
                    </div>
                    <ValidationReport report={validationReport} profile={profile} profiles={profilesMap} />
                  </>
                )
              : (
                  <>
                    <Stepper currentStep={stepIndex + 1} stepCount={steps.length} title={steps[stepIndex].title} nextTitle={steps[stepIndex + 1]?.title} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {steps[stepIndex].content}
                    </div>
                  </>
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
        {availableProfiles.map(profile => <ProfileDocumentation key={profile} profile={profilesMap[profile]} />)}
      </Section>
      <Section>
        <Alert title="Télécharger le validateur" severity="info" description={<p> Pour une utilisation avancée, vous pouvez télécharger le validateur sur cette <a href="https://github.com/BaseAdresseNationale/validateur-bal/releases" target="_blank" rel="noreferrer">page</a>.</p>} />
      </Section>
    </>
  )
}
