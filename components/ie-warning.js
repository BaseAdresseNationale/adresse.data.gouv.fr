import React from 'react'

const IEWarning = () => (
  <div className='ei-warning'>
    <p>
      Votre navigateur <b>Internet Explorer</b> n’est plus supporté par notre service.<br />
      <b>Nous vous recommandons d’utiliser un autre navigateur</b>
    </p>

    <style jsx>{`
      .ei-warning {
        display: none;
        padding: 10px;
        background-color: #F00;
        color: #FFF;
        text-align: center;
      }

      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        /* IE10+ CSS */
        .ei-warning {
          display: block;
        }
      }
    `}</style>
  </div>
)

export default IEWarning
