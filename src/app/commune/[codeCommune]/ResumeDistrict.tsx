'use client'

import { Fragment } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import {
  ResumeDistrictWrapper,
  ResumeDistrictActionsWrapper,
} from './ResumeDistrict.styles'
import { BANCommune } from '@/types/api-ban.types'
import Section from '@/components/Section'

const formatNumber = (value: string | number) => new Intl.NumberFormat('fr-FR').format(Number(value))

interface ResumeDistrictProps {
  district: BANCommune
  actionProps: any[]
}

function ResumeDistrict({ district, actionProps }: ResumeDistrictProps) {
  const { banId, codeCommune } = district

  return (
    <Section>
      <ResumeDistrictWrapper>
        <ul>
          <li className="ri-key-line">Code INSEE : <b>{codeCommune}</b></li>
          <li className="ri-signpost-line">
            {
              Number(district.codesPostaux.length) > 1
                ? <><b>{formatNumber(district.codesPostaux.length)}</b>&nbsp;codes Postaux</>
                : <>{district.codesPostaux.length || 'Aucune'} code Postal</>
            }{' '}
            <b>({district.codesPostaux.map(formatNumber).join(', ')})</b>
          </li>

          {banId && <li className="ri-key-line">Code(s) BAN : <b>{banId}</b></li>}
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
      </ResumeDistrictActionsWrapper>
    </Section>
  )
}

export default ResumeDistrict
