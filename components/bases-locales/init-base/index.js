import React from 'react'
import {remove} from 'lodash'
import MdFileDownload from 'react-icons/lib/md/file-download'

import {_get} from '../../../lib/fetch'

import Button from '../../button'
import ButtonLink from '../../button-link'

import Loader from '../../loader'

import SearchCommune from './search-communes'
import SelectCommunes from './select-communes'

class InitBase extends React.Component {
  state = {
    communes: [],
    csv: null,
    loading: false
  }

  addCommune = commune => {
    this.setState(state => {
      const communes = [...state.communes]
      let err = null

      if (communes.find(current => current.code === commune.code)) {
        err = new Error('Commune has already been added')
      } else {
        communes.push(commune)
      }

      return {
        communes,
        error: err,
        csv: null
      }
    })
  }

  removeCommune = commune => {
    this.setState(state => {
      const communes = [...state.communes]
      remove(communes, current => current.code === commune.code)

      return {
        communes,
        csv: null
      }
    })
  }

  handleGenerate = async () => {
    this.setState(state => {
      this.generate(state.communes)
      return {
        csv: null,
        loading: true
      }
    })
  }

  generate = async communes => {
    const url = 'https://adresse.data.gouv.fr/api-bal/ban/extract?communes=' + communes.map(c => c.code).join()
    let csv = null
    let error

    try {
      const response = await _get(url)
      const blob = await response.blob()
      csv = URL.createObjectURL(blob)
    } catch (err) {
      error = new Error(err)
    }

    this.setState({
      csv,
      error,
      loading: false
    })
  }

  render() {
    const {communes, loading, csv, error} = this.state

    return (
      <div>
        <h3>Rechercher les communes</h3>
        <SearchCommune
          handleSelect={this.addCommune}
          handleChange={() => this.setState({error: null})}
          error={error} />

        {communes.length > 0 &&
          <div>
            <h3>Communes sélectionnées</h3>
            <SelectCommunes communes={communes} handleRemove={this.removeCommune} />
          </div>
        }

        <div className='centered'>
          {csv ?
            <ButtonLink href={csv} download='nouvelle-bal.csv'>
              Télécharger <MdFileDownload />
            </ButtonLink> : (
              communes.length > 0 &&
                <Button onClick={this.handleGenerate}>
                  {loading ?
                    <span>Génération en cours… <Loader size='small' /></span> :
                    'Générer la base'
                  }
                </Button>
            )
          }
        </div>

        <style jsx>{`
          .centered {
            text-align: center;
          }

          span {
            display: flex;
            align-items: center;
          }
          `}</style>
      </div>
    )
  }
}

export default InitBase
