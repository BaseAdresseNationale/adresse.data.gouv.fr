import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

// Unable to pass the css by className, maybe a react-dropzone bug ¯\_(ツ)_/¯
const style = {
  width: '90%',
  margin: '20px auto',
  border: '1px dashed #ccc',
  height: '200px',
  textAlign: 'center'
}

const Holder = ({file, handleDrop}) => (
  <Dropzone style={style} multiple={false} onDrop={handleDrop}>
    {file ? <h2 className='centered'>{file.name}</h2> : <p className='centered'>Glisser un fichier ici (max 6Mo ou environ 15000 lignes), ou cliquer pour choisir</p>}
    <style jsx>{`
      .centered {
        display: flex;
        flex-flow: column;
        height: 100%;
        justify-content: center;
      }
      `}</style>
  </Dropzone>
)

Holder.propTypes = {
  handleDrop: PropTypes.func.isRequired
}

export default Holder
