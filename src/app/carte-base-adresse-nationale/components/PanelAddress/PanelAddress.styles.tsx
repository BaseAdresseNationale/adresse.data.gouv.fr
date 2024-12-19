'use client'

import styled from 'styled-components'

export const AddressDetailsWrapper = styled.ul`
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`

const AddressDetailsItemStyle = styled.li`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2em;

  b {
    font-weight: normal;
    font-size: 1.1em;
  }

  &.isSuccessful {
    color: var(--text-default-success);
  }

  &.isBAL {
    color: var(--text-label-blue-france);
  }

  &.isIsolated {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  &::before {
    margin-right: 0.5em;
    width: 1.25em;
    height: 1.25em;
    vertical-align: -0.25rem;
  }
`

interface AddressDetailsItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

export const AddressDetailsItem = ({ children, ...props }: AddressDetailsItemProps) => (
  <AddressDetailsItemStyle {...props}>
    <div>
      {children}
    </div>
  </AddressDetailsItemStyle>
)

interface AddressDetailsCertificationProps extends React.HTMLAttributes<HTMLLIElement> {
  isCertified: boolean
}

const AddressDetailsDesc = styled.div`
  display: block;
  font-size: 0.9em;
  font-style: italic;
  line-height: 1.5rem;
  padding-right: 1em;
  color: var(--text-mention-grey);
`

export const AddressDetailsCertification = ({ isCertified, className, ...props }: AddressDetailsCertificationProps) => (
  <AddressDetailsItemStyle
    {...props}
    className={
      `${isCertified ? 'ri-checkbox-circle-fill isSuccessful' : 'fr-icon-error-fill'} `
      + `isIsolated `
      + ` ${className}`
    }
  >
    <div>
      <strong>{isCertified ? `Cette adresse est certifiée` : 'Cette adresse n’est pas certifiée'}</strong>
      <AddressDetailsDesc>
        Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.
      </AddressDetailsDesc>
    </div>
  </AddressDetailsItemStyle>
)

interface AddressDetailsOriginProps extends React.HTMLAttributes<HTMLLIElement> {
  origin: string
}

export const AddressDetailsOrigin = ({ origin, className, ...props }: AddressDetailsOriginProps) => (
  <AddressDetailsItemStyle
    {...props}
    className={
      `${origin === 'bal' ? 'ri-star-fill isBAL' : 'ri-government-fill'} `
      + `isIsolated `
      + `${className}`
    }
  >
    <div>
      {origin === 'bal'
        ? (
            <>
              <strong>Cette adresse est issue d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</strong>
              <AddressDetailsDesc>
                Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.
              </AddressDetailsDesc>
            </>
          )
        : (
            <>
              <strong>Cette adresse à été produite par l’IGN à partir de sources diverses</strong>
              <AddressDetailsDesc>
                La commune n’a pas encore produit de Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL).
              </AddressDetailsDesc>
            </>
          )}
    </div>
  </AddressDetailsItemStyle>
)

export const AddressDetailsItemValue = styled.pre`
  font-size: small;
  font-weight: 700;
  margin-bottom: 0.5rem;
  white-space: pre-line;
`
