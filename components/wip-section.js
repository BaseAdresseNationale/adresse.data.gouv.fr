import PropTypes from 'prop-types'
import {fr} from '@codegouvfr/react-dsfr'

import Section from '@/components/section'

function WipSection({children}) {
  return (
    <>
      <Section className='section-work-in-progress'>
        <i className={fr.cx('fr-icon-warning-fill', 'fr-icon--lg', 'warn-icon')} />{' '}
        {children}
      </Section>

      <style jsx>{`
        :global(.section.section-work-in-progress) {
          font-weight: 900;
          color: #fff;
          background: #555;
        }
        :global(.section.section-work-in-progress) .warn-icon {
          color: #f60700;
          float: left;
          margin: 0 2em 0 0;
          transform: scale(1.5);
          transform-origin: top left;
        }
      `}</style>

    </>
  )
}

WipSection.propTypes = {
  children: PropTypes.node.isRequired,
}

export default WipSection
