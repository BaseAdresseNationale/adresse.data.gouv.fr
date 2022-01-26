import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Step from './step'

function Steps({step}) {
  return (
    <div className='steps'>
      <Step
        index={1}
        title='Dépôt des adresses'
        validTitle='Adresses conformes'
        isActif={step === 1}
        isValid={step > 1}
      />

      <Step
        index={2}
        title='Choix de la méthode d’habilitation'
        validTitle='Méthode d’habilitation sélectionnée'
        isActif={step === 2}
        isValid={step > 2}
        isDisabled={step < 2}
      />

      <Step
        index={3}
        title='Obtention de l’habilitation'
        validTitle='Habilitation obtenue'
        isActif={step === 3}
        isValid={step > 3}
        isDisabled={step < 3}
      />

      <Step
        index={4}
        title='Publication des adresses'
        validTitle='Adresses publiées'
        isActif={step === 4}
        isValid={step > 4}
        isDisabled={step < 4}
      />

      <style jsx>{`
        .steps {
          display: flex;
          margin: 2em 0;
          justify-content: space-around;
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
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
}

Steps.propTypes = {
  step: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired
}

export default Steps
