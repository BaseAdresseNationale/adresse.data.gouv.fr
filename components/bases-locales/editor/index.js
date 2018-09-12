// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'

import Button from '../../button'
import BAL from '../../../lib/bal/model'

import Uploader from './uploader'
import EditBal from './edit-bal'

function getDownloadLink(csvContent) {
  const blob = new Blob([csvContent], {type: 'text/csv'})
  return URL.createObjectURL(blob)
}

class Editor extends React.Component {
  state = {
    model: null,
    downloadLink: null,
    loading: false,
    error: null
  }

  handleData = tree => {
    this.setState({model: new BAL(tree)})
  }

  createNewFile = () => {
    this.setState({model: new BAL()})
  }

  reset = () => {
    this.setState({
      model: null
    })
  }

  exportBAL = async bal => {
    this.setState({loading: true})

    try {
      this.setState({
        downloadLink: getDownloadLink(await bal.exportAsCsv()),
        error: null,
        loading: false
      })
    } catch (err) {
      this.setState({
        downloadLink: null,
        error: err,
        loading: false
      })
    }
  }

  render() {
    const {model, downloadLink, loading, error} = this.state

    return (
      <div>
        {model ? (
          <EditBal
            model={model}
            downloadLink={downloadLink}
            filename='filename'
            exportBAL={this.exportBAL}
            loading={loading}
            error={error}
          />
        ) : (
          <div className='centered'>
            <Uploader onData={this.handleData} />
            <h2>Ou</h2>
            <Button onClick={this.createNewFile}>Créer un fichier <FaPencil /></Button>
          </div>
        )}

        {model && (
          <Button style={{display: 'flex', justifyContent: 'center'}} onClick={this.reset}>Clear</Button>
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
