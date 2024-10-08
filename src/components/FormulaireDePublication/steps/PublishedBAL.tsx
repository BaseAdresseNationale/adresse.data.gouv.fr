import Confetti from 'react-confetti'
import { Commune } from '@/types/api-geo.types'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import { useEffect, useRef, useState } from 'react'

interface PublishedBALProps {
  commune: Commune
  onReset: () => void
}

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .confetti {
    position: absolute;
  }

  section {
    margin-bottom: 2rem;
    padding: 0 1rem;
    li > span {
        margin-right: 0.5rem;
    }
  }

  .highlighted {
    background-color: #f5f5f5;
    border-radius: 0.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  button {
    align-self: center;
  }
`

export function PublishedBAL({ commune, onReset }: PublishedBALProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [wrapperDimensions, setWrapperDimensions] = useState<{ width: number, height: number }>()

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperDimensions({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight,
      })
    }
  }, [wrapperRef])

  return (
    <>
      <Confetti className="confetti" width={wrapperDimensions?.width} height={wrapperDimensions?.height} recycle={false} numberOfPieces={100} />

      <StyledWrapper ref={wrapperRef}>

        <h3>Votre Base Adresse Locale a bien été publiée !</h3>

        <section className="highlighted">
          <h4>🚀 Continuez l’édition de cette Base Adresse Locale</h4>
          <p>
            Pour <b>mettre à jour</b> vos adresses, il vous suffit de déposer un nouveau fichier .csv dans le formulaire. Il remplacera le précédent et sera transmis à la <b>Base Adresse Nationale</b>.
          </p>
        </section>

        <section>
          <h4>✨ Un réel bénéfice pour votre commune</h4>
          <p>
            Les adresses de votre commune sont <b>maintenant à jour</b> et viennent alimenter <b>les référentiels nationaux</b>.<br />{}
            Il est désormais plus simple pour vos administrés d’être&nbsp;:
          </p>
          <ul>
            <li><span>⚡️</span>Déclarés auprès des fournisseurs d’eau et d’énergies</li>
            <li><span>🖥</span>Éligibles à la fibre</li>
            <li><span>📦</span>Livrés</li>
            <li><span>🚑</span>Ou même secourus</li>
          </ul>
        </section>

        <section>
          <h4>🔍 Où consulter vos adresses ?</h4>
          <p>
            Vos adresses seront intégrées à la <b>Base Adresse Nationale</b> et disponibles d’ici <b>quelques heures</b>.<br />
            Elles seront consultables directement depuis notre <a href={`/base-adresse-nationale/${commune.code}`}>carte interactive</a>.
          </p>
          <p>Vous pourrez suivre <b>l’état de vos adresses</b> sur la page d’information par la commune et télécharger la <b>Base Adresse Nationale</b> de votre <a href={`/commune/${commune.code}`}>commune</a>.</p>
        </section>

        <section>
          <h4>🇫🇷 Vous n’êtes pas seul</h4>
          <p>
            <b>Tous les jours</b> de nouvelles Bases Adresse Locales viennent alimenter la Base Adresse Nationale comme vous venez de le faire.<br />
            Découvrez l’état du <a href="/deploiement-bal">déploiement des Bases Adresse Locales</a> à l’échelle nationale.
          </p>
        </section>

        <Button type="button" onClick={onReset}>
          Publier une autre Base Adresse Locale
        </Button>
      </StyledWrapper>
    </>
  )
}
