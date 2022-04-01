import {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp, Mail, Phone} from 'react-feather'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'
import {getMairie} from '@/lib/api-etablissements-public'

function Partner({partnerInfos, isCommune}) {
  const [isDisplay, setIsDisplay] = useState(false)
  const [mairieContact, setMairieContact] = useState(null)

  const {name, link, alt, infos, perimeter, codeCommune, services, picture, height, width, isCompany} = partnerInfos
  const contactDefaultValue = 'Non renseigné'

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
    <div className='partner'>
      <div className='general-partner-infos'>
        <p className='name'>
          <b><a href={link}>{`${name} ${isCompany ? '(société)' : ''}`}</a></b>
        </p>
        <div className='logo'>
          <Image
            src={picture}
            alt={alt}
            height={height}
            width={width}
            layout='fixed'
          />
        </div>
        {/* <div className='display-info-container'> */}
        <button type='button' onClick={() => setIsDisplay(!isDisplay)} className='button-container'>
          {isDisplay ? (
            <p>Masquer les informations</p>
          ) : (
            <p>Afficher les informations</p>
          )}
          <div className='chevron'>
            {isDisplay ? (
              <ChevronUp size={18} color={`${theme.colors.lightBlue}`} />
            ) : (
              <ChevronDown size={18} color={`${theme.colors.lightBlue}`} />
            )}
          </div>
        </button>
        {/* </div> */}
      </div>

      <div className={isDisplay ? 'infos-container' : 'hidden'}>
        {mairieContact ? (
          <div className='contacts-container'>
            <div className='title'>Contacter la mairie</div>
            <div>
              <div className='contact'>
                <Mail style={{marginRight: '10px'}} size={15} />
                {mairieContact.mail ? <a href={`mailto:${mairieContact.mail}`}>{mairieContact.mail}</a> : contactDefaultValue}
              </div>
              <div>
                <Phone style={{marginRight: '10px'}} size={15} />
                {mairieContact.phone ? <a href={`tel:+33${mairieContact.phone}`}>{mairieContact.phone}</a> : contactDefaultValue}
              </div>
            </div>
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
      </div>

      <style jsx>{`
        .partner {
          max-width: 300px;
          width: 100%;
          grid-template-rows: 0.5fr auto;
          grid-template-columns: 1fr;
          display: grid;
          align-items: start;
          justify-content: center;
          background: ${isCommune ? '#fceeac' : 'transparent'};
          padding: 1em;
          border-radius: 5px;
        }

        .general-partner-infos {
          text-align: left;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5em;
          width: 100%;
          height: 300px;
          align-content: space-between;
        }

        .name {
          margin: 0;
          font-size: 1em;
          font-weight: bold;
          font-style: normal;
          align-self: flex-start;
        }

        a {
          color: ${theme.colors.darkerGrey};
        }

        .logo {
          display: flex;
          justify-self: center;
        }

        .display-info-container {
          width: 100%;
          display: grid;
          grid-template-rows: 1fr 0.5fr;
          font-style: italic;
          color: ${theme.colors.darkerGrey};
          background: ${isCommune ? '#fceeac' : 'transparent'};
        }

        .button-container {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
          align-items: center;
          justify-items: self-start;
          border-style: none;
          background: ${isCommune ? '#fceeac' : 'transparent'};
          border-bottom: 2px solid ${theme.colors.lightBlue};
          box-shadow: 0px 14px 21px -15px ${theme.boxShadow};
          width: 100%;
          height: fit-content;
        }

        .chevron {
          justify-self: end;
          padding-top: 0.4em;
        }

        .infos-container {
          text-align: start;
          display: grid;
          grid-template-rows: 1fr auto;
          gap: 0.5em;
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
    services: PropTypes.array.isRequired,
    picture: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    alt: PropTypes.string.isRequired,
    isCompany: PropTypes.bool.isRequired
  }).isRequired,
  isCommune: PropTypes.bool
}

Partner.defaultProps = {
  isCommune: false
}

export default Partner
