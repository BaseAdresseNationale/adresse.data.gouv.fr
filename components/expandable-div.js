import PropTypes from 'prop-types'
import {Plus, Minus} from 'react-feather'
import theme from '@/styles/theme'

function ExpandableDiv({string, title, isShown, setIsShown, children}) {
  function handleClick() {
    if (isShown === string) {
      setIsShown(null)
    } else {
      setIsShown(string)
    }
  }

  return (
    <div onClick={() => handleClick()}>
      <div className='title'>
        {title}
        {isShown === string ? <Minus /> : <Plus />}
      </div>
      {isShown === string && (
        children
      )}
      <style jsx>{`
        .title {
          display: flex;
          justify-content: space-between;
          margin: 1em 0;
          font-size: 1.2em;
          font-weight: bolder;
          background-color: ${theme.primary};
          color: white;
          padding: .5em;
          border-radius: 5px;
        }

        .title:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

ExpandableDiv.defaultProps = {
  isShown: null
}

ExpandableDiv.propTypes = {
  string: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isShown: PropTypes.string,
  setIsShown: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default ExpandableDiv
