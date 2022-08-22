import PropTypes from 'prop-types'

import colors from '@/styles/colors'

import ActionButtonNeutral from '@/components/action-button-neutral'

function Tabs({activeTab, setActiveTab}) {
  return (
    <div className='tab-container'>
      <ActionButtonNeutral
        label='Afficher les voies'
        isFullSize
        onClick={() => {
          setActiveTab('VOIES')
        }}
      >
        <div className={`tab ${activeTab === 'VOIES' ? 'active' : 'inactive'}`}>Voies</div>
      </ActionButtonNeutral>

      <ActionButtonNeutral
        label='Afficher les lieux-dits'
        isFullSize
        onClick={() => {
          setActiveTab('LIEUXDITS')
        }}
      >
        <div className={`tab ${activeTab === 'LIEUXDITS' ? 'active' : 'inactive'}`}> Lieux-dits</div>
      </ActionButtonNeutral>

      <style jsx>{`
        .tab-container {
          margin-bottom: 0.5em;
          width: 100%;
          display: flex;
          border-top: 1px solid ${colors.lighterGrey};
        }

        .tab {
          flex: 1;
          text-align: center;
          padding: 0.5em;
          background-color: ${colors.lighterGrey};
          font-weight: bold;
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
