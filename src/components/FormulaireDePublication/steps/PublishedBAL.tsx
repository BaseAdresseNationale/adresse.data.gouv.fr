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
    li > span {
        margin-right: 0.5rem;
    }
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
            Elles seront consultables directement depuis notre <b>carte interactive</b>.
          </p>
          <a href={`/base-adresse-nationale/${commune.code}`}>Consulter la Base Adresse Nationale</a>

          <p>Vous pourrez suivre <b>l’état de vos adresses</b> sur la page d’information par la commune et télécharger la <b>Base Adresse Nationale</b> de votre commune</p>
          <a href={`/commune/${commune.code}`}>Consulter la page commune</a>

        </section>

        <section>
          <h4>🚀 Continuez l’édition de cette Base Adresse Locale</h4>
          <p>
            Pour <b>mettre à jour</b> vos adresses, il vous suffit de déposer un nouveau fichier .csv dans le formulaire. Il remplacera le précédent et sera transmis à la <b>Base Adresse Nationale</b>.
          </p>
        </section>

        <section>
          <h4>🇫🇷 Vous n’êtes pas seul</h4>
          <p>
            <b>Tous les jours</b> de nouvelles Bases Adresse Locales viennent alimenter la Base Adresse Nationale comme vous venez de le faire.<br />
            Découvrez l’état du <b>déploiement des Bases Adresse Locales</b> à l’échelle nationale.
          </p>
          <a href="/deploiement-bal">Carte de couverture des BAL</a>
        </section>

        <Button type="button" onClick={onReset}>
          Publier une autre Base Adresse Locale
        </Button>
      </StyledWrapper>
    </>
  )
}
