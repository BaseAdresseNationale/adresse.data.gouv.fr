import React from 'react'
import PropTypes from 'prop-types'

import FaFolder from 'react-icons/lib/fa/folder'
import FaFolderOpen from 'react-icons/lib/fa/folder-open'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaMagic from 'react-icons/lib/fa/magic'
import FaTrash from 'react-icons/lib/fa/trash'
import FaRecycle from 'react-icons/lib/fa/recycle'

import theme from '../../../../styles/theme'

import Button from '../../../button'

import TextInput from './text-input'

class Item extends React.Component {
  state = {
    editMode: false,
    open: false
  }

  static propTypes = {
    item: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      removed: PropTypes.bool.isRequired,
      created: PropTypes.bool.isRequired,
      edited: PropTypes.string
    }).isRequired,
    remove: PropTypes.func.isRequired,
    subitems: PropTypes.func,
    rename: PropTypes.func,
    fix: PropTypes.func,
    select: PropTypes.func
  }

  static defaultProps = {
    subitems: () => {},
    rename: null,
    fix: null,
    select: null
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

  handleMagic = event => {
    const {item, fix} = this.props
    event.preventDefault()

    fix(item)
  }

  handleRemove = event => {
    const {item, remove} = this.props
    event.preventDefault()

    remove(item)
  }

  handleSubmit = input => {
    const {item, rename} = this.props
    this.setState({editMode: false})
    rename(item, input)
  }

  render() {
    const {editMode, open} = this.state
    const {item, subitems, select, rename, fix} = this.props
    const {nom, edited, created, removed} = item
    const subitem = subitems(item)
    let {border} = theme
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
        {select && (
          <div onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
            <Button style={{margin: '0 5px'}} size='small' title={subitem} onClick={select}>
              {open ? <FaFolderOpen /> : <FaFolder />}
            </Button>
          </div>
        )}

        <div className='item'>
          <div className='names'>
            <div className='name'>{nom}</div>
            {edited && <div className='edited'>{edited}</div>}
          </div>

          {editMode && (
            <TextInput
              placeholder={nom}
              handleSubmit={this.handleSubmit}
            />
          )}

          <div className='infos'>
            <div className='subitems'>
              {subitem}
            </div>

            <div className='tools'>
              {rename && (
                <Button style={{margin: '0 5px'}} title='Renommer' size='small' onClick={this.handleMode}>
                  <FaPencil />
                </Button>
              )}
              {fix && (
                <Button style={{margin: '0 5px'}} title='Corriger' size='small' onClick={this.handleMagic}>
                  <FaMagic />
                </Button>
              )}
              <Button style={{margin: '0 5px'}} title='Supprimer' size='small' color={removed ? null : 'red'} onClick={this.handleRemove}>{removed ? <FaRecycle /> : <FaTrash />}</Button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .container {
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
          }

          .item {
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

          .infos {
            display: flex;
            align-items: center;
          }

          .subitems {
            margin: 5px 0;
          }

          .tools {
            display: flex;
          }

          .tools div {
            margin: 0 5px;
          }
        `}</style>
      </div>
    )
  }
}

export default Item
