import PropTypes from 'prop-types'
import Image from 'next/image'

import Section from '@/components/section'
import theme from '@/styles/theme'

function CommuneInfos({communeInfos}) {
  const {codeCommune, codesPostaux, departement, nomCommune, nbNumeros, nbVoies, nbLieuxDits, population, region} = communeInfos

  return (
    <Section title='Carte d’identité de la commune'>
      <div className='all-infos-wrapper'>
        <div className='name-container'>
          <Image src='/images/icons/commune.svg' height={80} width={80} layout='fixed' />
          <div className='name'>{nomCommune} - {codeCommune}</div>
        </div>

        <div className='general-infos-container'>
          <div>
            <div className='label'>Région</div>
            <div className='value'>{region.nom} ({region.code})</div>
          </div>
          <div>
            <div className='label'>Département</div>
            <div className='value'>{departement.nom} ({departement.code})</div>
          </div>
          <div>
            <div className='label'>Code Postal</div>
            <div>{codesPostaux.map(code => <span className='value' key={code}>{code}</span>)}</div>
          </div>
          <div>
            <div className='label'>Population</div>
            <div className='value'>{population} habitants</div>
          </div>
        </div>

        <div>
          <h3>Les adresses de la commune en quelques chiffres</h3>
          <div className='cards-container'>
            <div className='number-card'>
              <div>Nombre de numéros</div>
              <div>{nbNumeros}</div>
            </div>
            <div className='number-card'>
              <div>Nombre de voies</div>
              <div>{nbVoies}</div>
            </div>
            <div className='number-card'>
              <div>Nombre de lieux-dits</div>
              <div>{nbLieuxDits}</div>
            </div>
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
