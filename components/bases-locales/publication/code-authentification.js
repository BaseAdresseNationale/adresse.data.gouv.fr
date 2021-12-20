import {useCallback, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Check, ArrowLeft} from 'react-feather'

import {submitAuthentificationCode} from '@/lib/api-depot'

import theme from '@/styles/theme'

import Button from '@/components/button'
import Notification from '@/components/notification'

function CodeAuthentification({habilitationId, email, handleValidCode, sendBackCode, cancel}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  const submitCode = useCallback(async () => {
    try {
      const habilitation = await submitAuthentificationCode(habilitationId, code)

      if (habilitation?.validated === false) {
        const {error, remainingAttempts} = habilitation
        if (remainingAttempts > 0) {
          throw new Error(`${error}. Tentative restantes : ${remainingAttempts}`)
        }

        throw new Error(error)
      }

      handleValidCode(habilitation)
    } catch (error) {
      setError(error.message)
    }
  }, [habilitationId, code, handleValidCode])

  const handleInput = event => {
    const {value} = event.target
    if (value.length <= 6) {
      setCode(event.target.value)
    }
  }

  useEffect(() => {
    setError(null)
  }, [code])

  return (
    <>
      <div className='code-container'>
        <h3>Entrez le code qui vous a été envoyé à l’adresse : {email}</h3>

        <div className='form'>
          <div className='input-container'>
            <input
              autoFocus
              name='code'
              type='number'
              value={code}
              placeholder='Entrez votre code ici'
              onChange={handleInput}
            />
            <button type='submit' disabled={code.length !== 6} onClick={submitCode}>
              <Check />
            </button>
          </div>
          {error && <Notification message={error} type='error' />}

          <div>
            <div>Vous n’avez pas reçu votre code ?</div>
            <div onClick={sendBackCode}><a>Renvoyer un code à l’adresse {email}</a></div>
          </div>
        </div>
      </div>

      <Button onClick={cancel} color='secondary'><ArrowLeft style={{verticalAlign: 'top'}} /> Retour</Button>

      <style jsx>{`
        .code-container {
          margin: 2em 0;
          padding: 1em;
          background-color: ${theme.backgroundGrey};
        }

        .form {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 100%;
        }

        .input-container {
          display: flex;
          margin-bottom: 1em;
        }

        .input-container input {
          width: 100%;
          max-width: 400px;
          height: 60px;
          font-size: x-large;
          border-radius: 3px 0 0 3px;
          border-right-width: 0;
        }

        /* Chrome, Safari, Edge, Opera */
        .input-container input::-webkit-outer-spin-button,
        .input-container input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        .input-container input[type=number] {
          -moz-appearance: textfield;
        }

        .input-container button {
          width: 50px;
          border-radius: 0 3px 3px 0;
          border: none;
          background-color: #0053b3;
          color: #fff;
        }

        .input-container button:disabled {
          background-color: ${theme.borderLighter};
        }
        `}</style>
    </>
  )
}

CodeAuthentification.propTypes = {
  habilitationId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleValidCode: PropTypes.func.isRequired,
  sendBackCode: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}

export default CodeAuthentification
