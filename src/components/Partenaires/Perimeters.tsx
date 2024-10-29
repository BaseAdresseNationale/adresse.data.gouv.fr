import Badge from '@codegouvfr/react-dsfr/Badge'
import { findCommuneName } from '@/utils/cog'
import { PerimeterType } from '@/types/api-depot.types'

interface PerimetersProps {
  perimeters: PerimeterType[]
}

export default function Perimeters({ perimeters }: PerimetersProps) {
  return (
    <section className="fr-py-4w">
      <h3>Perimètres</h3>
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
  )
}
