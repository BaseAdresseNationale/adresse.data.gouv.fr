import {profiles} from '@ban-team/validateur-bal'
import theme from '@/styles/theme'

import Section from '@/components/section'
import ProfileDocumentation from './profile-documentation'

function ValidatorDocumentation() {
  return (
    <Section>
      <div className='report-container'>
        <h1>Documentation Validateur</h1>

        <p>Le Validateur BAL vérifie qu&apos;un fichier soit conforme au format Base Adresse Locale.</p>
        <p>Il est utilisé pour s&apos;assurer avant la publication que toutes les adresses d&apos;une BAL remonteront correctement dans la Base Adresse Nationale.</p>

        <span>
          Il existe deux profils sur le validateur :
          <ul>
            <li><strong>BAL 1.3</strong> est le profil par défaut. Il assure une conformité complète avec la spécification de l&apos;AITF.</li>
            <li><strong>BAL 1.3 Relax </strong> est un profil exceptionnel déprécié. Il permet plus de tolérance tout en assurant une intégrité minimale de la donnée adresse.</li>
          </ul>
        </span>

        <p>Si le fichier est invalide, le validateur BAL affiche un rapport en deux parties.</p>
        <span>
          Tout d&apos;abord une validation générale sur tout le fichier qui renvoie les éléments suivants :
          <ul>
            <li><strong>Les erreurs</strong> sont bloquantes et entraînent un rejet du fichier BAL. Il sera considéré comme non valide.</li>
            <li><strong>Les alertes</strong> n&apos;empêchent pas la publication et le fichier BAL sera donc accepté, mais ces dernières peuvent être corrigées pour une meilleure intégrité des données.</li>
          </ul>
        </span>
        {Object.values(profiles).filter(p => p.isUsed).map(p => (
          <ProfileDocumentation key={p.code} profile={p} type='generale' />
        ))}
        <br />
        <span>
          Puis une validation adresse par adresse qui renvoie les éléments suivants :
          <ul>
            <li><strong>Les erreurs</strong> sont bloquantes et entraînent un rejet de l&apos;adresse concernée. La BAL publiée sera alors incomplète.</li>
            <li><strong>Les alertes</strong> n&apos;empêchent pas la publication et l&apos;adresse sera donc acceptée, mais les informations rattachées à l&apos;adresse seront dégradées.</li>
          </ul>
        </span>
        {Object.values(profiles).filter(p => p.isUsed).map(p => (
          <ProfileDocumentation key={p.code} profile={p} type='field' />
        ))}
      </div>
      <style jsx>{`
        .report-container {
          margin: 2em 0;
          padding: 2em 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }
      `}</style>
    </Section>
  )
}

export default ValidatorDocumentation

