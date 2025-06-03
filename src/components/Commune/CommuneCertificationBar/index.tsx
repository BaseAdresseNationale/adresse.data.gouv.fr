import CardWrapper from '../../CardWrapper'
import { formatFr } from '@/lib/array'
import { assemblageSources } from '@/lib/api-ban'
import { BANCommune } from '@/types/api-ban.types'
import formatNumber from '@/app/carte-base-adresse-nationale/tools/formatNumber'
import { StyledWrapper } from './CommuneCertificationBar.styles'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CommuneCertificationBarProps {
  commune: BANCommune
  lastRevisionsDetails: (string | JSX.Element | null)[][] | null
  certificationPercentage: number
  communeHasBAL: boolean
}

export function CommuneCertificationBar({ commune, certificationPercentage, communeHasBAL, lastRevisionsDetails }: CommuneCertificationBarProps) {
  return (
    <StyledWrapper $certificationPercentage={certificationPercentage}>
      <CardWrapper>
        <div className="adresse-recap">
          <div>
            {commune.nbVoies}
          </div>
          <label>
            voies, places et lieux-dits adressés
          </label>
        </div>
        <div className="adresse-recap">
          <div>
            {commune.nbNumeros}
          </div>
          <label>
            adresses
          </label>
        </div>
        <div className="adresse-recap">
          <div>
            {certificationPercentage} %
          </div>
          <label>
            d&apos;adresses certifiées
          </label>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className="publication-recap">
          <label>
            <i className="fr-icon-send-plane-line" />
            Mode de publication
          </label>
          <div>
            {!communeHasBAL && 'Assemblage'}
            {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][2]}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-plug-line" />
            Source
          </label>
          <div>
            {!communeHasBAL && formatFr(assemblageSources(commune.voies))}
            {communeHasBAL && lastRevisionsDetails && lastRevisionsDetails[0][3]}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="fr-icon-refresh-line" />
            Dernière mise à jour
          </label>
          <div>
            {!communeHasBAL && '-'}
            {communeHasBAL && lastRevisionsDetails && format(parseISO(lastRevisionsDetails[0][1] as string), '\'le\' dd MMMM yyyy \'à\' HH:mm', { locale: fr })}
          </div>
        </div>
      </CardWrapper>
      <CardWrapper>
        <div className="publication-recap">
          <label>
            <i className="ri-links-line" />
            Code INSEE
          </label>
          <div>
            {commune.codeCommune}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-signpost-line" />
            {
              Number(commune.codesPostaux.length) > 1
                ? <><b>{formatNumber(commune.codesPostaux.length)}</b>&nbsp;codes Postaux</>
                : <>{commune.codesPostaux.length || 'Aucune'} code Postal</>
            }{' '}
          </label>
          <div>
            {commune.codesPostaux.join(', ')}
          </div>
        </div>
        <div className="publication-recap">
          <label>
            <i className="ri-key-line" />
            Identifiant BAN :
          </label>
          <div>
            {commune.banId || '-'}
          </div>
        </div>
      </CardWrapper>
    </StyledWrapper>
  )
}
