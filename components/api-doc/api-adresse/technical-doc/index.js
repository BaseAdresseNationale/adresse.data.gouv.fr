import PropTypes from 'prop-types'
import {Book} from 'react-feather'

import Section from '@/components/section'

import Attributs from './attributs'
import Path from './path'

function TechnicalDoc({paths, defaultModel, defaultAttributs, optionAttributs}) {
  return (
    <Section background='color'>

      <div className='title'>
        <div className='feather-icon'><Book alt aria-hidden='true' /></div>
        <h2 className='h2'>Documentation technique</h2>
      </div>

      <div>
        {paths.map(path => (
          <Path key={path.name} {...path} />
        ))}
        <Attributs
          model={defaultModel}
          defaults={defaultAttributs}
          optionals={optionAttributs}
        />
      </div>

      <style jsx>{`
        .h2 {
          margin-top: 22px;
        }
        .title {
          display: flex;
          align-items: center;
        }

        .title > svg {
          margin-right: 1em;
        }

        .feather-icon {
          font-size: 25px;
          margin-right: 0.31em;
        }
        `}</style>
    </Section>
  )
}

TechnicalDoc.propTypes = {
  paths: PropTypes.array.isRequired,
  defaultModel: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  defaultAttributs: PropTypes.array.isRequired,
  optionAttributs: PropTypes.array
}

TechnicalDoc.defaultProps = {
  optionAttributs: []
}

export default TechnicalDoc
