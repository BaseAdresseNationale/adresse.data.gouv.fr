import PropTypes from 'prop-types'
import {numFormater} from '@/lib/format-numbers'
import DoughnutCounter from '@/components/doughnut-counter'

const options = {
  height: 200,
  width: 200,
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

function PanelSource({stats, formatedStats}) {
  const {
    dataPopulationCouverte,
    communesCouvertesPercent,
    dataCommunesCouvertes,
    adressesGereesBALPercent,
    dataAdressesGereesBAL,
    adressesCertifieesPercent,
    dataAdressesCertifiees,
    total
  } = formatedStats

  return (
    <div>
      <div className='stats'>
        {!Number.isNaN(adressesGereesBALPercent) && <DoughnutCounter
          title='Adresses issues des BAL'
          valueUp={numFormater(stats.bal.nbAdresses)}
          valueDown={`${adressesGereesBALPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
          data={dataAdressesGereesBAL}
          options={options}
        />}
        <DoughnutCounter
          title='Communes couvertes'
          valueUp={numFormater(stats.bal.nbCommunesCouvertes)}
          valueDown={`${communesCouvertesPercent}% des ${numFormater(total.nbCommunes)} communes`}
          data={dataCommunesCouvertes}
          options={options}
        />
        <DoughnutCounter
          title='Population couverte'
          valueUp={numFormater(stats.bal.populationCouverte)}
          valueDown={`${Math.round((stats.bal.populationCouverte * 100) / total.population)}% des ${numFormater(total.population)} d’habitants`}
          data={dataPopulationCouverte}
          options={options}
        />
        {!Number.isNaN(adressesGereesBALPercent) && <DoughnutCounter
          title='Adresses certifiées'
          valueUp={numFormater(stats.bal.nbAdressesCertifiees)}
          valueDown={`${adressesCertifieesPercent}% des ${numFormater(stats.ban.nbAdresses)} d’adresses présentes dans la BAN`}
          data={dataAdressesCertifiees}
          options={options}
        />}
      </div>

      <style jsx>{`
        .stats {
          height: fit-content;
          display: grid;
          grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
          gap: 1em;
          margin-top: 1em;
        }
      `}</style>
    </div>
  )
}

PanelSource.propTypes = {
  stats: PropTypes.object.isRequired,
  formatedStats: PropTypes.object.isRequired,
}

export default PanelSource
