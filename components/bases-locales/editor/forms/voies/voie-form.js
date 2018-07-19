import React from 'react'
import PropTypes from 'prop-types'

import SearchCommune from '../../../init-base/search-communes'

class VoieForm extends React.Component {
  static propTypes = {
    input: PropTypes.string.isRequired,
    commune: PropTypes.object,
    communes: PropTypes.array.isRequired,
    handleInput: PropTypes.func.isRequired,
    handleCommune: PropTypes.func.isRequired
  }

  static defaultProps = {
    commune: null
  }

  handleChange = event => {
    const {handleInput} = this.props
    event.preventDefault()
    handleInput(event.target.value)
  }

  handleSelect = event => {
    const {handleCommune, communes} = this.props
    const communeId = event.target.value
    const commune = communes.find(commune => commune.id === communeId)

    event.preventDefault()

    handleCommune(commune)
  }

  render() {
    const {input, commune, communes, handleCommune} = this.props

    return (
      <div className='voie-form'>
        <div>
          <label>Nom de la voie</label>
          <input type='text' placeholder='Avenue Victor Hugo' value={input} onChange={this.handleChange} />
        </div>

        <div>
          <label>Commune</label>
          <div className='commune'>
            {communes.length > 0 && (
              <div>
                <select onChange={this.handleSelect}>
                  <option value={null}>Choisir une commune</option>
                  {communes.map(commune => (
                    <option key={commune.code} value={commune.id}>
                      {commune.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <SearchCommune
              placeholder={commune ? commune.nom : null}
              handleSelect={commune => handleCommune(commune, true)}
            />
          </div>
        </div>

        <style jsx>{`
          .voie-form {
            display: flex;
            flex-direction: column;
          }

          .voie-form div {
            margin: 0.5em 0;
          }

          .commune {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default VoieForm
