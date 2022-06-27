import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'
import theme from '@/styles/theme'

import MairieContact from '@/components/mairie/mairie-contact'
import MairieSchedules from '@/components/mairie/mairie-schedules'

function MairieCard({nom, horaires, email, telephone}) {
  return (
    <div className='mairie-infos'>
      <div className='mairie-name'>
        <Image src='/images/icons/commune.svg' height={80} width={80} alt='' />
        <b>{nom}</b>
      </div>
      <div>
        <MairieContact email={email} phone={telephone} />
        <MairieSchedules scheldules={horaires} />
      </div>

      <style jsx>{`
        .mairie-infos {
          margin-top: 1em;
          padding: 1em;
          background-color: ${colors.lighterGrey};
        }

        .mairie-infos > div {
          margin-top: 1em;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mairie-name {
          font-size: 26px;
        }

        .horaires {
          width: 80%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1em;
          gap: 1em;
          border-top: 2px solid ${theme.borderLighter};
        }

        .horaire-dropdown {
          font-size: 17px;
          font-weight: bolder;
          display: flex;
          gap: 5px;
          cursor: pointer;
          text-decoration: underline;
        }

        .horaires > div {
          padding: 0 1em;
        }
      `}</style>
    </div>
  )
}

MairieCard.defaultProps = {
  email: null,
  telephone: null,
  horaires: null
}

MairieCard.propTypes = {
  nom: PropTypes.string.isRequired,
  email: PropTypes.string,
  telephone: PropTypes.string,
  horaires: PropTypes.array
}

export default MairieCard
