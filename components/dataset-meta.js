import PropTypes from 'prop-types'

import theme from '../styles/theme'

const DatasetMeta = ({producer, updateFrequency, license}) => (
  <div>
    <div className='meta'>
      <div>
        <b>Producteur :</b><span>{producer}</span>
      </div>

      {updateFrequency &&
        <div>
          <b>Fréquence de mise à jour :</b><span>{updateFrequency}</span>
        </div>}

      {license &&
        <div>
          <b>Licence :</b><span>{license}</span>
        </div>}
    </div>
    <style jsx>{`
      .meta {
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;
        margin: 0 auto;
        margin-left: 4em;
        line-height: 2em;
      }

      .meta span {
        margin-left: 1em;
        padding: 0.2em;
        border-radius: 3px;
        background-color: ${theme.backgroundGrey};
        color: ${theme.colors.almostBlack};
      }
      `}</style>
  </div>
)

DatasetMeta.propTypes = {
  producer: PropTypes.string.isRequired,
  updateFrequency: PropTypes.string,
  license: PropTypes.string
}

DatasetMeta.defaultProps = {
  updateFrequency: null,
  license: null
}

export default DatasetMeta
