// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'

import Button from '../../button'

import HandleFile from './handle-file'
import EditBal from './edit-bal'

function getDownloadLink(csvContent) {
  const blob = new Blob([csvContent], {type: 'text/csv'})
  return URL.createObjectURL(blob)
}

class Editor extends React.Component {
  state = {
    tree: null,
    downloadLink: null,
    loading: false,
    createMode: false,
    error: null
  }

  componentDidMount() {
    const tree = localStorage.getItem('tree')

    if (tree) {
      this.setState({tree: JSON.parse(tree)})
    }
  }

  handleTree = tree => {
    this.setState({tree})
    localStorage.setItem('tree', JSON.stringify(tree))
  }

  handleCreateMode = () => {
    this.setState({createMode: true})
  }

  reset = () => {
    this.setState({
      tree: null,
      createMode: false
    })
    localStorage.clear()
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
    const {tree, downloadLink, createMode, loading, error} = this.state

    return (
      <div>
        {tree || createMode ? (
          <EditBal
            tree={tree}
            downloadLink={downloadLink}
            filename='filename'
            exportBAL={this.exportBAL}
            loading={loading}
            error={error}
          />
        ) : (
          <div className='centered'>
            <HandleFile handleTree={this.handleTree} />
            <h2>Ou</h2>
            <Button onClick={this.handleCreateMode}>Créer un fichier <FaPencil /></Button>
          </div>
        )}

        {tree && (
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
