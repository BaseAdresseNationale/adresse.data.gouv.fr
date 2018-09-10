// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'

import Button from '../../button'

import HandleFile from './handle-file'
import EditBal from './edit-bal'

async function getDownloadLink() {
  const blob = new Blob(['foo'], {type: 'text/csv'})
  return URL.createObjectURL(blob)
}

class Editor extends React.Component {
  state = {
    tree: null,
    csv: null,
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

  createBAL = async tree => {
    let csv = null
    let error = null

    this.setState({loading: true})

    try {
      csv = await getDownloadLink(tree)
    } catch (err) {
      error = err
    }

    this.setState({
      csv,
      loading: false,
      error
    })
  }

  render() {
    const {tree, csv, createMode, loading, error} = this.state

    return (
      <div>
        {tree || createMode ? (
          <EditBal
            tree={tree}
            csv={csv}
            filename='filename'
            reset={this.reset}
            createBAL={this.createBAL}
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
          <Button style={{display: 'flex', justifyContent: 'center'}} onClick={this.clearStorage}>Clear</Button>
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
