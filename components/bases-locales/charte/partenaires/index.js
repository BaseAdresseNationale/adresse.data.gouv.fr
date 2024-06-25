import PropTypes from 'prop-types'
import {useMemo} from 'react'
import {flattenDeep} from 'lodash'
import Section from '@/components/section'

import Badge from '@codegouvfr/react-dsfr/Badge'
import MoissonneurBal from './moissonneur-bal'
import Perimeters from './perimeter'

function Partenaire({partenaireDeLaCharte, moissonneur: {organizations, sources}}) {
  const aggregatePerimeters = useMemo(() => flattenDeep(organizations.map(({perimeters}) => perimeters)), [organizations])

  return (
    <Section>
      <section>
        <div className='fr-container fr-py-2w'>
          <div className='fr-grid-row' style={{flexWrap: 'nowrap'}}>
            <div>
              <div className='logo' style={{backgroundImage: `url("${partenaireDeLaCharte.picture}")`}} />
            </div>
            <div>
              <h2>{partenaireDeLaCharte.name}</h2>
              {partenaireDeLaCharte.infos &&
                <p>{partenaireDeLaCharte.infos}</p>}
            </div>
          </div>
        </div>
        <div className='fr-container fr-py-2w'>
          {partenaireDeLaCharte.services &&
            <div style={{margin: 'var(--text-spacing)'}}>
              {partenaireDeLaCharte.services?.map(s => (
                <Badge key={s} style={{marginRight: '5px', marginBottom: '5px'}}>{s}</Badge>
              ))}
            </div>}
        </div>
      </section>

      {partenaireDeLaCharte.dataGouvOrganizationId && (
        <>
          <h2>Publication de Bases Adresse Locales</h2>
          <p>{partenaireDeLaCharte.name} mutualise la production et diffusion des Bases Adresses Locales (BAL).</p>

          <Perimeters perimeters={aggregatePerimeters} />
          <MoissonneurBal sources={sources} />
        </>
      )}
      <style jsx>{`
        .logo {
          width: 200px;
          min-height: 200px;
          height: 100%;
          margin: 0 1em 0 0;
          background-size: contain;
          background-repeat: no-repeat;
        }
      `}</style>
    </Section>
  )
}

Partenaire.propTypes = {
  partenaireDeLaCharte: PropTypes.object.isRequired,
  moissonneur: PropTypes.object,
}

export default Partenaire
