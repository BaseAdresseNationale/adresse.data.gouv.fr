import PropTypes from 'prop-types'
import Image from 'next/image'

import theme from '@/styles/theme'

import Section from '@/components/section'
import CommuneIdCard from '@/components/commune-id-card'
import Counter from '@/components/ui/metrics/counter'

function CommuneInfos({communeInfos}) {
  const {codeCommune, codesPostaux, departement, nomCommune, nbNumeros, nbVoies, nbLieuxDits, population, region} = communeInfos

  return (
    <Section title='Carte d’identité de la commune'>
      <div className='all-infos-wrapper'>
        <div className='name-container'>
          <Image src='/images/icons/commune.svg' height={80} width={80} layout='fixed' alt aria-hidden='true' />
          <div className='name'>{nomCommune} - {codeCommune}</div>
        </div>

        <CommuneIdCard
          region={region}
          departement={departement}
          codesPostaux={codesPostaux}
          population={population}
        />

        <div>
          <h3>Les adresses de la commune en quelques chiffres</h3>

          <div className='cards-container'>
            <Counter label={nbVoies <= 1 ? 'Voie répertoriée' : 'Voies répertoriées'} value={nbVoies} />
            <Counter label={nbLieuxDits <= 1 ? 'Lieu-dit répertorié' : 'Lieux-dits répertoriés'} value={nbLieuxDits} />
            <Counter label={nbNumeros <= 1 ? 'Numéro répertorié' : 'Numéros répertoriés'} value={nbNumeros} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .all-infos-wrapper,  .general-infos-container div {
          display: flex;
          flex-direction: column;
        }

        .name, .label,{
          font-weight: bold;
        }

        .all-infos-wrapper {
          gap: 2em;
          text-align: center;
        }

        .name {
          color: ${theme.colors.darkerGrey};
          font-size: 26px;
        }

        .general-infos-container {
          color: ${theme.colors.white};
          background: ${theme.primary};
          border-radius: 8px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1em;
          padding: 5px;
        }

        .general-infos-container div {
          background: transparent;
        }

        .label {
          font-size: 20px;
        }

        .value {
          font-size: 18px;
          font-weight: 100;
        }

        h3 {
          color: ${theme.colors.darkerGrey};
          margin: 2em 0;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 4em;
        }

        .number-card {
          background: ${theme.backgroundGrey};
          padding: 2em;
          border-radius: 5px;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          gap: 2em;
        }

        .number-card div:first-child {
          font-size: 27px;
        }

        .number-card div:last-child {
          font-size: 3em;
          color: ${theme.primary};
        }
      `}</style>
    </Section>
  )
}

CommuneInfos.propTypes = {
  communeInfos: PropTypes.object.isRequired
}

export default CommuneInfos
