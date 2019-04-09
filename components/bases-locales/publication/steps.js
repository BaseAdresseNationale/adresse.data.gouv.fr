import React from 'react'
import PropTypes from 'prop-types'

import Step from './step'

const Steps = React.memo(({step}) => {
  return (
    <div className='steps'>
      <Step
        index={1}
        title='Déposez vos adresses'
        validTitle='Adresses conformes'
        validate={step > 1}
      />

      <Step
        index={2}
        title='Vérification de l’habilitation'
        validTitle='Authentifié'
        validate={step > 2}
        disable={step < 2}
      />

      <Step
        index={3}
        title='Demande de publication'
        validTitle='Publié'
        validate={step > 3}
        disable={step < 3}
      />

      <style jsx>{`
        .steps {
          display: flex;
          margin: 2em 0;
          justify-content: space-between;
        }
      `}</style>
    </div>
  )
})

Steps.propTypes = {
  step: PropTypes.oneOf([1, 2, 3]).isRequired
}

export default Steps
