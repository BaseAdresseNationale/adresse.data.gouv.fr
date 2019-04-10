import React, {useState} from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'
import Button from '../../button'

const Form = React.memo(({mail}) => {
  const [applicant, setApplicant] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [eluMail, setEluMail] = useState('')

  return (
    <form>
      <h2>Demander la publication de vos adresses</h2>
      <div className='input'>
        <div>
          <label>Demandeur :</label>
        </div>
        <div>
          <input
            type='text'
            value={applicant}
            onChange={e => setApplicant(e.target.value)}
            required
          />
        </div>
      </div>

      <div className='columns'>
        <div className='input'>
          <div>
            <label>Adresse email (optionnel) :</label>
          </div>
          <div>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className='input'>
          <label>Téléphone (optionnel) :</label>
          <input
            type='tel'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className='marge'>
        <label>Message à l’attention de votre élu ou du secrétariat de votre commune :</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>

      <div className='section'>
        <h3>Envoyer la demande de publication</h3>

        <div className='columns'>
          <div className='choice'>
            <div>Au secrétariat</div>
            {mail && <div>Adresse email de la mairie : <b>{mail}</b></div>}

            <div className='button'>
              <Button disabled>Envoyer</Button>
              <div className='disabled'>Bientôt disponible</div>
            </div>
          </div>

          <div className='choice'>
            <div>À l’élu</div>
            <div className='inline-input'>
              <label>Adresse email de la mairie :</label>
              <div>
                <input
                  type='email'
                  value={eluMail}
                  onChange={e => setEluMail(e.target.value)}
                />
              </div>
            </div>

            <div className='button'>
              <Button>Envoyer</Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marge {
          margin: 1em 0;
        }

        .columns {
          display: flex;
          flex-direction: columns;
          align-items: center;
        }

        .input {
          display: flex;
          flex-direction: column;
          margin: 0.5em;
          max-width: 250px;
        }

        .inline-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.5em;
        }

        .inline-input input {
          margin: 0 1em;
        }

        .section {
          border-radius: 2px;
          padding: 1em;
          text-align: center;
          background: ${theme.colors.lighterGrey};
          box-shadow: 0 1px 4px 0 ${theme.boxShadow};
        }

        .section .columns {
          justify-content: space-around;
        }

        .choice {
          display: grid;
          grid-row-gap: 0.5em;
        }

        .disabled {
          color: ${theme.colors.grey};
          font-style: italic;
          margin: 0.5em 0;
        }

        textarea {
          width: 100%;
          height: 300px;
        }
      `}</style>
    </form>
  )
})

Form.propTypes = {
  mail: PropTypes.string
}

Form.defaultProps = {
  mail: null
}

export default Form
