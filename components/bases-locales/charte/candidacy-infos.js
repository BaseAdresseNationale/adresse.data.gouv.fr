import PropTypes from 'prop-types'
import Link from 'next/link'

import Button from '@codegouvfr/react-dsfr/Button'

function CandidacyInfos({onConfirm}) {
  return (
    <div>
      <p>
        Vous souhaitez accompagner les communes sur l&apos;adresse et promouvoir le format Base Adresse Locale?</p>
      <p>
        En devenant partenaire, nous vous proposons d’être mieux identifié à travers la Charte de la Base Adresse Locale. L’objectif est de fédérer les organismes qui privilégient ce format (attention ce format doit bien être respecté, voir <a target='_blank' href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/le-format-base-adresse-locale' rel='noreferrer'>ici</a>) et de les porter à connaissance des communes. Les communes doivent respecter l&apos;obligation suivante : « le conseil municipal procède à la dénomination des voies et lieux-dits, y compris les voies privées ouvertes à la circulation » (<a target='_blank' href='https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000045197622' rel='noreferrer'>loi 3DS</a>), ce qui constitue un important travail de complétude des adresses (lieux-dits et voies privées ouvertes à la circulation sont nouveaux depuis la loi 3DS).
      </p>
      <p>
        Avec cette Charte, vous pourrez ainsi être référencé sur ce site comme partenaire des Bases Adresses Locales, et vous afficherez la Charte sur votre site. Vous serez convié à nos échanges mensuels en visioconférences. Vous serez également invité à participer au canal slack de l&apos;adresse. Nul besoin de signature.
      </p>
      <p>
        Votre organisme sera présenté à partir de la page des Chartes.
        Une présentation des organismes est également proposée aux communes sur la page <Link href='/gerer-mes-adresses'>Gérer mes adresses</Link> à la rubrique &quot;Outils disponibles sur votre territoire&quot;.
      </p>
      <Button onClick={onConfirm} style={{color: 'white'}}>
        Je souhaite rejoindre les partenaires de la Charte
      </Button>
    </div>
  )
}

CandidacyInfos.propTypes = {
  onConfirm: PropTypes.func.isRequired,
}

export default CandidacyInfos
