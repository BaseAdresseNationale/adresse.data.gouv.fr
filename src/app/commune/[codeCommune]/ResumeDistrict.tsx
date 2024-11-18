'use client'

import { Fragment, useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'

import {
  ResumeDistrictWrapper,
  ResumeDistrictActionsWrapper,
  DistrictDetailsItem,
  StyledIframeWrapper,
  StyledIframe,
} from './ResumeDistrict.styles'

const formatNumber = (value: string | number) => new Intl.NumberFormat('fr-FR').format(Number(value))

interface ResumeDistrictProps {
  district: any
  actionProps: any[]
}

function ResumeDistrict({ district, actionProps }: ResumeDistrictProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'

  return (
    <div>
      <link href={iframeSRC} rel="prefetch" />
      <ResumeDistrictWrapper>
        <ul>
          <DistrictDetailsItem className="ri-group-line">
            <b>{formatNumber(district.data.population)}</b>&nbsp;habitants
          </DistrictDetailsItem>
          <DistrictDetailsItem className="ri-shield-check-line">
            {
              Number(district.data.nbNumerosCertifies) > 1
                ? <><b>{formatNumber(district.data.nbNumerosCertifies)}</b>&nbsp;adresses certifiées</>
                : <>{district.data.nbNumerosCertifies || 'Aucune'} adresse certifiée</>
            }{'\u00A0/\u00A0'}
            <b>{formatNumber(district.data.nbNumeros)}</b>&nbsp;adresses répertoriées{' '}
            <b>({Math.round((district.data.nbNumerosCertifies / district.data.nbNumeros) * 100)}%)</b>
          </DistrictDetailsItem>
          <DistrictDetailsItem className="ri-signpost-line">
            {
              Number(district.data.codesPostaux.length) > 1
                ? <><b>{formatNumber(district.data.codesPostaux.length)}</b>&nbsp;codes Postaux</>
                : <>{district.data.codesPostaux.length || 'Aucune'} code Postal</>
            }{' '}
            <b>({district.data.codesPostaux.map(formatNumber).join(', ')})</b>
          </DistrictDetailsItem>
          <DistrictDetailsItem className="ri-edit-box-line">Source des données BAN : <b>{district.data.typeComposition === 'bal' ? 'Base Adresse Local (BAL)' : 'Assemblage IGN'}</b></DistrictDetailsItem>
        </ul>

        <ul>
          <DistrictDetailsItem className="ri-key-line">Identifiant district BAN : <b>{district.id}</b></DistrictDetailsItem>
          <DistrictDetailsItem className="ri-shield-keyhole-line">Identificateur d’adresse :{' '}
            <b>{district.data.voies?.[0]?.banId ? 'Stable (Identifiants BAN)' : 'Volatile (Clé d’interoprabilité)'}</b>
          </DistrictDetailsItem>
          <DistrictDetailsItem className="ri-global-line">Langue par defaut : <b>{district.config?.lang || 'Français'}</b></DistrictDetailsItem>
          <DistrictDetailsItem className="ri-file-paper-2-line">Certificat d’addressage :{' '}
            <b>{ district.config?.certificate ? 'Activé' : 'Non activé'}</b>
          </DistrictDetailsItem>
        </ul>
      </ResumeDistrictWrapper>

      <ResumeDistrictActionsWrapper>
        {actionProps && actionProps.length && actionProps.map(props => (
          <Fragment key={props.iconId}>
            <Button
              iconId={props.iconId}
              linkProps={{
                href: props.linkProps.href,
                target: props.linkProps.target,
              }}
              priority={props.priority}
            >
              {props.value}
            </Button>
            {' '}
          </Fragment>
        ))}
        <Button
          key="set-config"
          iconId="ri-settings-line"
          onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
        >
          Configurer les options de la commune
        </Button>
      </ResumeDistrictActionsWrapper>

      <Section title={`Configuration des options pour la commune de ${district.data.nomCommune}`} theme="grey" isVisible={isConfigDistrictVisible}>
        <p>
          <i>
            Cette fonctionnalité est en développement.
            Vous pouvez vous inscrire en liste d’attente pour l’activation
            du certificat d’adressage pour votre commune.
          </i>
        </p>
        <StyledIframeWrapper>
          <StyledIframe src={iframeSRC} width="100%" height="800" frameBorder="0" />
        </StyledIframeWrapper>
      </Section>
    </div>
  )
}

export default ResumeDistrict
