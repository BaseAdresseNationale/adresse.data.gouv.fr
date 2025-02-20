import Badge from '@codegouvfr/react-dsfr/Badge'
import { findCommuneName } from '@/utils/cog'
import { PerimeterType } from '@/types/api-depot.types'
import Accordion from '@codegouvfr/react-dsfr/Accordion'

interface PerimetersProps {
  perimeters: PerimeterType[]
  style?: React.CSSProperties
}

export default function Perimeters({ perimeters, style }: PerimetersProps) {
  return (
    <Accordion id="perimeters" label="Périmètres" style={style}>
      <section className="fr-py-4w">
        {(perimeters && perimeters.length > 0)
          ? (
              <>
                {perimeters.filter(({ type }) => type === 'commune').map(({ code }) => (
                  <Badge key={code} style={{ marginLeft: '5px', marginBottom: '5px' }}>{findCommuneName(code)} ({code})</Badge>
                ))}
                {perimeters.filter(({ type }) => type === 'departement').map(({ code }) => (
                  <Badge key={code} style={{ marginLeft: '5px', marginBottom: '5px' }}>Département {code}</Badge>
                ))}
                {perimeters.filter(({ type }) => type === 'epci').map(({ code }) => (
                  <Badge key={code} style={{ marginLeft: '5px', marginBottom: '5px' }}>Epci {code}</Badge>
                ))}
              </>
            )
          : (
              <p>Aucun perimètre</p>
            )}
      </section>
    </Accordion>
  )
}
