import React from 'react'

import theme from '../../../styles/theme'

class Legend extends React.PureComponent {
  render() {
    return (
      <div className='legend'>
        <div>
          <i className='lov2' /> BAL disponible sous Licence Ouverte
        </div>
        <div>
          <i className='odbl' /> BAL disponible sous licence ODbL
        </div>
        <div>
          <i className='adressage' /> Démarche territoriale d’adressage
        </div>

        <style jsx>{`
          .legend {
            z-index: 1;
            padding: 1em 1em;
            background: #ffffffc4;
            position: absolute;
            top: calc(600px - 32px);
            border-radius: 5px;
            right: 5px;
          }

          .legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: .7;
          }

          .legend .lov2 {
            background: ${theme.colors.green};
          }

          .legend .odbl {
            background: ${theme.colors.orange};
          }

          .legend .adressage {
            background: ${theme.colors.lightGrey};
          }
        `}</style>
      </div>
    )
  }
}

export default Legend
