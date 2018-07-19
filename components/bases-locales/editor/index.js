// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime'
import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'

import Button from '../../button'

import HandleFile from './handle-file'
import EditBal from './edit-bal'

class Editor extends React.Component {
  state = {
    csv: null,
    createMode: false
  }

  handleCsv = csv => {
    this.setState({csv})
  }

  handleCreateMode = () => {
    this.setState({createMode: true})
  }

  render() {
    const {csv, createMode} = this.state

    return (
      <div>
        {csv || createMode ? (
          <EditBal csv={csv} />
        ) : (
          <div className='centered'>
            <HandleFile handleCsv={this.handleCsv} />
            <h2>Ou</h2>
            <Button onClick={this.handleCreateMode}>Créer un fichier <FaPencil /></Button>
          </div>
        )}

        <style jsx>{`
          .centered {
            display: flex;
            flex-direction: column;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}

export default Editor
