import {useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'
import Image from 'next/legacy/image'
import Link from 'next/link'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'
import {getMairie} from '@/lib/api-etablissements-public'

import MairieContact from '@/components/mairie/mairie-contact'
import ActionButtonNeutral from '@/components/action-button-neutral'
import ButtonLink from '@/components/button-link'

const StyledActionButtonNeutral = styled(ActionButtonNeutral)`
  display: flex;
  justify-content: space-between;
  text-decoration: underline;
  align-items: center;
  margin-bottom: 1em;

  &:hover {
    background: none !important;
  }

  > p {
    margin: 0;
  }
`

function Partner({partnerInfos, isCommune}) {
  const [isDisplay, setIsDisplay] = useState(false)
  const [mairieContact, setMairieContact] = useState(null)

  const {name, link, infos, perimeter, codeCommune, services, testimonyURL, isCompany, picture, charteURL} = partnerInfos
  const Chevron = isDisplay ? ChevronUp : ChevronDown

  const getMairieInfos = useCallback(async () => {
    if (isCommune && codeCommune) {
      const mairie = await getMairie(codeCommune)
      const {properties} = mairie.features[0]

      setMairieContact(
        {
          mail: properties.email,
          phone: properties.telephone
        }
      )
    }
  }, [isCommune, codeCommune])

  useEffect(() => {
    getMairieInfos()
  }, [getMairieInfos])

  return (
    <div className={`partner ${isDisplay && isCommune ? 'open-commune-partner' : ''}`}>
      <div className='general-partner-infos'>
        <p className='name'>
          <b><a href={link}>{`${name} ${isCompany ? '(société)' : ''}`}</a></b>
          {isCommune && <Image src='/images/icons/commune.svg' height={35} width={35} layout='fixed' alt='Ce partenaire est une commune' />}
        </p>
        <div className='logo' style={{backgroundImage: `url(${picture})`}} />

        {services && services.length > 0 && (

          <StyledActionButtonNeutral
            isFullSize
            label={`${isDisplay ? 'Masquer' : 'Afficher'} les informations`}
            onClick={() => setIsDisplay(!isDisplay)}
          >
            <p>{isDisplay ? 'Masquer' : 'Afficher'} les informations</p>
            <div className='chevron'>
              <Chevron size={18} color={`${theme.colors.lightBlue}`} alt='' aria-hidden='true' />
            </div>
          </StyledActionButtonNeutral>
        )}
      </div>
      {services && services.length > 0 && (
        <div className={isDisplay ? 'infos-container' : 'hidden'}>
          {mairieContact ? (
            <div className='contacts-container'>
              <div className='title'>Contacter la mairie</div>
              <MairieContact email={mairieContact.mail} phone={mairieContact.phone} />
            </div>
          ) : (
            <>
              <p>{infos}</p>
              <div className='perimeter'>
                <div className='title'>Périmètre</div>
                <p>{perimeter}</p>
              </div>
            </>
          )}
          <div className='services'>
            <div className='title'>Offres de services</div>
            {services.map(service => {
              return <p key={service}>{formatTag(service)}</p>
            })}
          </div>
          {testimonyURL && (
            <Link href={partnerInfos.testimonyURL} legacyBehavior>
              <a className='temoignage'>Voir le témoignage</a>
            </Link>
          )}
          {charteURL && (
            <ButtonLink href={charteURL} isExternal target='_blank' label={`Voir la charte de ${name}`} style={{marginTop: '10px'}}>
              Voir la charte
            </ButtonLink>
          )}
        </div>
      )}

      <style jsx>{`
        .partner {
          max-width: 300px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          padding: 1em;
          border-radius: 5px;
          border: ${isCommune ? `solid 3px ${theme.primary}` : ''};
        }

        .open-commune-partner {
          background-image: url('/images/icons/scarf.svg');
          background-repeat:  no-repeat;
          background-position: 115% 109%;
        }

        .general-partner-infos {
          width: 100%;
          align-content: space-between;
        }

        .name {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0;
          font-size: 1em;
          font-weight: bold;
          font-style: normal;
        }

        a {
          color: ${theme.colors.darkerGrey};
        }

        .logo {
          height: 200px;
          margin: 1em 0;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .display-info-container {
          width: 100%;
          font-style: italic;
          color: ${theme.colors.darkerGrey};
        }

        .chevron {
          justify-self: end;
          padding-top: 0.4em;
        }

        .infos-container {
          margin-top: 1em;
          animation: fadeIn ease 1s;
        }

        p {
          font-style: italic;
          color:${theme.colors.darkerGrey};
        }

        .title {
          font-size: 1em;
          font-weight: normal;
          margin: 0;
          font-style: italic;
          color: ${theme.colors.almostBlack};
        }

        .perimeter p, .services p {
          margin: 0;
          font-size: 0.9em;
          font-weight: bold;
          color: ${theme.colors.almostBlack};
        }

        .hidden {
          display: none;
        }

        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1;}
        }

        .contacts-container {
          margin-top: 1em;
          color: ${theme.primary};
        }

        .contact {
          display: flex;
          align-items: center;
        }

        .temoignage:hover {
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}

Partner.propTypes = {
  partnerInfos: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    infos: PropTypes.string,
    codeCommune: PropTypes.string,
    perimeter: PropTypes.string,
    services: PropTypes.array,
    testimonyURL: PropTypes.string,
    charteURL: PropTypes.string,
    picture: PropTypes.string.isRequired,
    isCompany: PropTypes.bool
  }).isRequired,
  isCommune: PropTypes.bool
}

export default Partner
