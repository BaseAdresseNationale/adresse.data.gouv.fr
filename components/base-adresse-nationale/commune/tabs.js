import React from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'

function Tabs({activeTab, setActiveTab}) {
  return (
    <div className='tab-container'>
      <div className={`tab ${activeTab === 'VOIES' ? 'active' : 'inactive'}`}
        onClick={() => {
          setActiveTab('VOIES')
        }}
      >
        Voies
      </div>
      <div className={`tab ${activeTab === 'LIEUXDITS' ? 'active' : 'inactive'}`}
        onClick={() => {
          setActiveTab('LIEUXDITS')
        }}
      >
        Lieux-dits
      </div>

      <style jsx>{`
        .tab-container {
          margin: 1.4em 0 0.5em 0;
          width: 100%;
          display: flex;
          border-top: 1px solid ${colors.lighterGrey};
        }

        .tab {
          flex: 1;
          text-align: center;
          padding: 0.5em;
          background-color: ${colors.lighterGrey}
        }

        .tab:hover {
          cursor: pointer;
        }

        .active {
          border-bottom : 3px solid ${colors.lightBlue};
          background-color: ${colors.white}
        }

        .inactive:hover {
          background-color: ${colors.white}
        }
    `}</style>
    </div>
  )
}

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired
}
export default Tabs
