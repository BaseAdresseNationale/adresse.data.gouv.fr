// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'
import FaPencil from 'react-icons/lib/fa/pencil'

import Button from '../../button'

import HandleFile from './handle-file'
import EditBal from './edit-bal'

class Editor extends React.Component {
  state = {
    tree: null,
    createMode: false
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

  clearStorage = () => {
    this.setState({tree: null})
    localStorage.clear()
  }

  render() {
    const {tree, createMode} = this.state

    return (
      <div>
        {tree || createMode ? (
          <EditBal tree={tree} />
        ) : (
          <div className='centered'>
            <HandleFile handleTree={this.handleTree} />
            <h2>Ou</h2>
            <Button onClick={this.handleCreateMode}>Créer un fichier <FaPencil /></Button>
          </div>
        )}

        {tree && (
          <Button onClick={this.clearStorage}>Clear</Button>
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
