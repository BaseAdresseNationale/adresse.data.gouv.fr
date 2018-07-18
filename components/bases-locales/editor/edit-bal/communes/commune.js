import React from 'react'
import PropTypes from 'prop-types'

import FaFolder from 'react-icons/lib/fa/folder'
import FaFolderOpen from 'react-icons/lib/fa/folder-open'
import FaCheck from 'react-icons/lib/fa/check'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaMagic from 'react-icons/lib/fa/magic'
import FaTrash from 'react-icons/lib/fa/trash'
import FaRecycle from 'react-icons/lib/fa/recycle'

import theme from '../../../../../styles/theme'

class Commune extends React.Component {
  state = {
    editMode: false,
    input: '',
    open: false
  }

  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      removed: PropTypes.bool.isRequired,
      created: PropTypes.bool.isRequired,
      edited: PropTypes.string
    }).isRequired,
    rename: PropTypes.func.isRequired,
    magic: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  }

  handleHover = event => {
    event.preventDefault()
    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  handleMode = event => {
    event.preventDefault()
    this.setState(state => {
      return {
        editMode: !state.editMode
      }
    })
  }

  handleChange = event => {
    event.preventDefault()
    this.setState({input: event.target.value})
  }

  handleMagic = event => {
    const {commune, magic} = this.props
    event.preventDefault()

    magic(commune)
  }

  handleRemove = event => {
    const {commune, remove} = this.props
    event.preventDefault()

    remove(commune)
  }

  handleSubmit = event => {
    const {input} = this.state
    const {commune, rename} = this.props
    event.preventDefault()

    this.setState({editMode: false})
    rename(commune, input)
  }

  render() {
    const {input, editMode, open} = this.state
    const {commune, select} = this.props
    const {nom, edited, created, removed} = commune
    let border = theme.border
    let background = theme.colors.white

    if (removed) {
      border = theme.errorBorder
      background = theme.errorBg
    } else if (created) {
      border = theme.successBorder
      background = theme.successBg
    } else if (edited) {
      border = theme.warningBorder
      background = theme.warningBg
    }

    return (
      <div className='container'>
        <div onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
          <button alt='Voir les voies' onClick={() => select(commune)}>
            {open ? <FaFolderOpen /> : <FaFolder />}
          </button>
        </div>

        <div className='commune'>
          <div className='names'>
            <div className='name'>{nom}</div>
            {edited && <div className='edited'>{edited}</div>}
          </div>

          {editMode &&
            <div className='form'>
              <input type='text' defaultValue={input || nom} onChange={this.handleChange} />
              <button type='submit' className='valid' onClick={this.handleSubmit}><FaCheck /></button>
            </div>}

          <div className='tools'>
            <button onClick={this.handleMode}><FaPencil /></button>
            <button onClick={this.handleMagic}><FaMagic /></button>
            <button className={`${removed ? '' : 'remove'}`} onClick={this.handleRemove}>{removed ? <FaRecycle /> : <FaTrash />}</button>
          </div>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
          }

          .commune {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 5px;
            background-color: ${background};
            border: 1px solid ${border};
            border-radius: 4px;
            font-weight: bold;
          }

          .names {
            display: flex;
          }

          .name {
            text-decoration: ${edited ? 'line-through' : 'inherit'};
          }

          .edited {
            margin-left: 1em;
          }

          .tools {
            display: flex;
          }

          .form {
            display: flex;
          }

          button,
          button:focus,
          button:active,
          button:visited {
            display: inline-block;
            margin: 0 5px;
            padding: 0.2em 0.5em;
            color: #fff;
            background-color: ${theme.secondary};
            border-radius: ${theme.borderRadius};
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
            border: 1px solid transparent;
            border-bottom: 2px solid ${theme.primaryDark};
            font-family: "Evolventa", "Trebuchet MS", sans-serif;
            font-size: 1.2em;
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.25s;
            text-align: center;
          }

          button.remove {
            background-color: ${theme.colors.red};
          }

          button:hover {
            background: ${theme.secondaryDarken};
          }

          button.remove:hover {
            background: #bd254b;
          }

          button.valid {
            background-color: ${theme.colors.green};
          }

          button.valid:hover {
            background: ${theme.colors.green};
          }

          button:active {
            transform: translateY(2px);
            border-bottom: 0;
            margin-bottom: 2px;
            box-shadow: none;
          }
        `}</style>
      </div>
    )
  }
}

export default Commune
