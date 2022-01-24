import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Doughnut} from 'react-chartjs-2'
import {Mail, Phone} from 'react-feather'

import theme from '@/styles/theme'

import Section from '@/components/section'
import SectionText from '@/components/section-text'

function toCounterData(percent, total) {
  return {
    labels: [],
    datasets: [
      {
        data: [percent, total],
        backgroundColor: [
          '#0054B3',
          '#FCB955'
        ],
        borderColor: [
          '#FFFFFF',
        ],
        borderWidth: 3,
      },
    ]
  }
}

const options = {
  height: 50,
  width: 50,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false
    }
  }
}

function BALState({communeName, nbNumeros, nbNumerosCertifies, mairieContact, revision}) {
  const certifiedPercent = (nbNumerosCertifies / nbNumeros) * 100
  const doughnutData = toCounterData(Math.round(certifiedPercent), 100 - Math.round(certifiedPercent))
  const updatedDate = revision ? `le ${new Date(revision.updatedAt).toLocaleDateString('fr-FR')}` : 'non renseigné'

  let userName = revision && (revision.context.nomComplet || revision.context.organisation)

  if (revision && !userName) {
    if (revision.habilitation.strategy.type === 'email') {
      userName = `la mairie de ${communeName}`
    } else if (revision.habilitation.strategy.type === 'franceconnect') {
      userName = `l'élu(e) de ${communeName}`
    }
  }

  const subtitle = useMemo(() => {
    if (revision) {
      const clientName = revision.client.nom

      if (userName && clientName) {
        return `Les adresses de la commune proviennent de la Base Adresse Locale de ${userName}, via ${clientName}`
      }

      if (userName && !clientName) {
        return `Les adresses de la commune proviennent de la Base Adresse Locale de ${userName}`
      }
    }
  }, [revision, userName])

  return (
    <Section title='État de la Base Adresse Nationale' background='color' subtitle={subtitle}>
      <div className='bal-state-wrapper'>
        <div className='statistiques-container'>
          <div className='bal-states-container'>
            <div className='doughnut'>
              <Doughnut data={doughnutData} options={options} />
              <div className='update'>Dernières mises à jour des données : <b>{updatedDate}</b></div>
            </div>
            <div className='numbers'>
              <div className='addresses-number'>
                <div className='certified-number'>{nbNumerosCertifies}</div>
                adresses certifiées.
              </div>
              <div className='addresses-number'>
                <div className='uncertified-number'>{nbNumeros - nbNumerosCertifies}</div>
                adresses non certifiées (ou en attente).
              </div>
            </div>
          </div>
          <p className='percent'>Aujourd’hui, <b>{certifiedPercent.toFixed(2)} %</b> de la totalité des adresses de la commune sont certifiées.</p>
        </div>
      </div>

      <div className='contact-wrapper'>
        <SectionText color='secondary'>
          Il n’existe pas encore de dispositif national permettant aux citoyens de contribuer directement à la Base Adresse Locale, mais de <b>nombreux guichets de signalement</b> existent à l’échelon local. Ce site a vocation à les référencer à moyen terme. En attendant, <b>contactez votre mairie</b> et parlez-leur de nous !
        </SectionText>
        <div className='contacts-container'>
          <div className='contact'><Phone /><a href={`tel:${mairieContact.telephone}`}>{mairieContact.telephone || 'non renseigné'}</a></div>
          <div className='contact'><Mail /> <a href={`mailto:${mairieContact.email}`}>{mairieContact.email || 'non renseigné'}</a></div>
        </div>
      </div>

      <style jsx>{`
        .statistiques-container {
          text-align: center;
          background: ${theme.colors.white};
          color: ${theme.darkText};
          margin-top: 3em;
          border-radius: 8px;
          padding: 2em;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .bal-states-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          gap: 2em;
        }

        .doughnut {
          max-width: 250px;
        }

        .update {
          font-size: 11px;
          font-style: italic;
          margin-top: 5px;
        }

        .numbers {
          min-width: 250px;
          display: flex;
          flex-direction: column;
          gap: 2em;
          font-weight: bold;
          font-size: x-large;
        }

        .addresses-number {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .certified-number, .uncertified-number {
          font-size: xxx-large;
        }

        .certified-number {
          color: ${theme.primary};
        }

        .uncertified-number {
          color: #FCB955;
        }

        .percent {
          font-size: x-large;
          margin: 0;
          padding-top: 1em;
          border-top: solid 3px ${theme.border};
        }

        .percent b {
          color: ${theme.primary};
        }

        .contact-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contact {
          display: flex;
          gap: 10px;
          margin: 1em 0;
        }
      `}</style>
    </Section>
  )
}

BALState.propTypes = {
  communeName: PropTypes.string.isRequired,
  mairieContact: PropTypes.object.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  nbNumerosCertifies: PropTypes.number.isRequired,
  revision: PropTypes.object
}

BALState.defaultType = {
  revision: {}
}

export default BALState
