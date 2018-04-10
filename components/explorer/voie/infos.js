import PropTypes from 'prop-types'

const Infos = ({voie}) => (
  <div className='voie-infos'>
    <div className='infos'>
      <h4>Nombre d’adresse</h4>
      <div>{voie.nbNumeros}</div>
    </div>

    <div className='infos'>
      <h4>Noms de la voie</h4>
      {voie.nomsVoie.map(nom => <div key={nom}>{nom}</div>)}
    </div>

    <div className='infos'>
      <h4>Sources</h4>
      {voie.sources.map(source => <div key={source}>{source}</div>)}
    </div>

    <div className='infos'>
      <h4>Code de la voie</h4>
      <div>{voie.codeVoie}</div>
    </div>
    <style jsx>{`
      .voie-infos {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-flow: wrap;
        margin-top: -2em;
        padding: 1em 0;
      }
      `}</style>
  </div>
)

Infos.propTypes = {
  voie: PropTypes.shape({
    nbNumeros: PropTypes.number.isRequired,
    nomsVoie: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    codeVoie: PropTypes.string.isRequired
  })
}

export default Infos
