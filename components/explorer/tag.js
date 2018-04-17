import PropTypes from 'prop-types'
import theme from '../../styles/theme'

const Tag = ({type, style}) => (
  <div className={`tag ${type}`} style={style}>
    {type}
    <style jsx>{`
      .tag {
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 12px;
      }

      .ban {
        background-color: ${theme.warningBorder};
        border: 1px solid ${theme.warningBg};
      }

      .bano {
        background-color: ${theme.successBorder};
        border: 1px solid ${theme.warningBg};
      }

      .cadastre {
        background-color: ${theme.errorBorder};
        border: 1px solid ${theme.errorBg};
      }
      `}</style>
  </div>
)

Tag.propTypes = {
  type: PropTypes.oneOf([
    'ban',
    'bano',
    'cadastre'
  ]).isRequired,
  style: PropTypes.object
}

Tag.defaultProps = {
  style: null
}

export default Tag
