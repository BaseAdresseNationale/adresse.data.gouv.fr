import React from 'react'
import PropTypes from 'prop-types'

import Step from './step'

const Steps = React.memo(({step}) => {
  return (
    <div className='steps'>
      <Step
        index={1}
        title='Dépôt des adresses'
        validTitle='Adresses conformes'
        isValid={step > 1}
      />

      <Step
        index={2}
        title='Choix de la méthode d’habilitation'
        validTitle='Méthode d’habilitation sélectionnée'
        isValid={step > 2}
        disable={step < 2}
      />

      <Step
        index={3}
        title='Obtention de l’habilitation'
        validTitle='Habilitation obtenue'
        isValid={step > 3}
        disable={step < 3}
      />

      <Step
        index={4}
        title='Publication des adresses'
        validTitle='Adresses publiées'
        isValid={step > 4}
        disable={step < 4}
      />

      <style jsx>{`
        .steps {
          display: flex;
          margin: 2em 0;
          justify-content: space-between;
        }

        @media (max-width: 700px) {
          .steps {
            display: grid;
            grid-template-columns: 1fr;
            grid-gap: 0.5em;
            align-self: center;
          }
        }
      `}</style>
    </div>
  )
})

Steps.propTypes = {
  step: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired
}

export default Steps
