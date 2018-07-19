import React from 'react'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import Button from '../../../button'

import ClosablePanel from './closable-panel'

class PopUp extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    childs: PropTypes.string.isRequired,
    accept: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
  }

  render() {
    const {item, name, childs, accept, close} = this.props

    return (
      <div className='pop-up'>
        <ClosablePanel title={`Souhaitez-vous également supprimer ${name} ?`} handleClose={close}>
          <div>Attention cette action supprimera également <b>{childs}</b>.</div>

          <div className='buttons'>
            <Button size='small' color='green' onClick={() => accept(item)}>Oui <FaCheck /></Button>
            <Button size='small' color='red' onClick={close}>Non <FaClose /></Button>
          </div>
        </ClosablePanel>

        <style jsx>{`
          .pop-up {
            position: fixed;
            z-index: 9999999;
            top: 25%;
            left: 40%;
            width: 25%;
            background: #fff;
          }

          .buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default PopUp
