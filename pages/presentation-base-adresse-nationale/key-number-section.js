import PropTypes from 'prop-types'

import Section from '@/components/section'

import KeyNumberItem from './key-number-item'

function KeyNumberSection({backgroundColor, title, children, data}) {
  return (
    <>
      <Section background={backgroundColor} className='key-number-section'>
        {title && <h2>{title}</h2>}

        <div className='key-numbers'>
          {data.map(item => (
            <KeyNumberItem key={item.label} number={item.number} label={item.label} description={item.description} unity={item.unity} />
          ))}
          {/* <KeyNumberItem number={12.34} label='Téléchargements' description='des données BAN sur nos serveurs.*' />
          <KeyNumberItem number={12.34} label='Recherche' description='effectuées sur notre API BAN-Geocodage.*' />
          <KeyNumberItem number={12.34} label='Exploitants' description='utilisant les données de la BAN sur leurs outils.**' /> */}
        </div>

        {/* <ul className='key-numbers-asterix'>
          <li>
            * Moyenne mensuelle.
          </li>
          <li>
            ** Total referencé.
          </li>
        </ul> */}
        {children}
      </Section>

      <style jsx>{`
          .key-number-section {
          background-color: var(--blue-france-975-75);
        }

        .key-numbers {
          display: flex;
          gap: 3.5em;
          margin: 4em 0;
        }
        .key-numbers > :global(*):not(:last-child)::before {
          content: '';
          width: 1px;
          /* background-color: #313178; */
          background-color: currentColor;
          display: block;
          position: absolute;
          top: 1.5em;
          bottom: 1.5em;
          right: -1.75em;
          opacity: 0.3;
        }
        .key-numbers-asterix {
          font-size: 0.75em;
          line-height: 1.5;
          list-style: none;
          padding-left: 0;
        }

  `}</style>
    </>
  )
}

KeyNumberSection.propTypes = {
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  data: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.number.isRequired,
    unity: PropTypes.string,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
  })),
}

export default KeyNumberSection
