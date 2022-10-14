import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {shuffle} from 'lodash'
import {CheckSquare, HelpCircle} from 'react-feather'

import Section from '../section'
import ButtonLink from '../button-link'
import Partners from '@/components/bases-locales/charte/partners'

import Notification from '../notification'
import partners from '../../partners.json'
import SectionText from '../section-text'
import MapBalSection from '../map-bal-section'

const BasesLocales = React.memo(({stats}) => {
  const [shuffledPartners, setShuffledPartners] = useState([])

  // Utilisation d'un useEffect afin d'éviter les mélanges de rendus de valeurs au render lors du shuffle
  useEffect(() => {
    const randomizedPartners = shuffle([...partners.companies, ...partners.epci, ...partners.communes]).slice(0, 3)
    setShuffledPartners(randomizedPartners)
  }, [])

  return (
    <div>
      <Section>
        <div style={{textAlign: 'center'}}>
          <SectionText>
            <p>
              La <b>création des voies et des adresses</b> en France est du ressort des <b>communes</b>, via le conseil municipal.<br />{}
              Les communes peuvent néanmoins être accompagnées par une structure de mutualisation (EPCI, département, …).
            </p>
            <p>
              Une <b>Base Adresse Locale</b> regroupe toutes les adresses d’une ou plusieurs communes et est <b>publiée sous leur responsabilité</b>.
            </p>

            <p>
              Les Bases Adresses Locales constituent les <b>adresses prioritaires de la Base Adresse Nationale</b>. Validées par la commune, les adresses d’une Base Adresse Locale apparaissent dans l’explorateur de la Base Adresse Nationale comme « <b>certifiées par la commune</b> » ou « <b>en cours de certification par la commune</b> ».
            </p>
          </SectionText>
          <div className='explorateur-button-container'>
            <ButtonLink href='/base-adresse-nationale'>Accéder à l’explorateur</ButtonLink>
          </div>

          <div className='parters'>
            <div className='partner'>
              <div><Image src='/images/logos/logo-anct.png' alt aria-hidden='true' width={190} height={80} layout='fixed' /></div>
              <div><b>Le Programme Bases Adresses Locales de l’Agence Nationale pour la Cohésion des Territoires (ANCT)</b> est en place pour faciliter leur déploiement.</div>
            </div>

            <div className='partner'>
              <div><Image src='/images/logos/logo-AMF.jpg' alt aria-hidden='true' width={201} height={106} layout='fixed' /></div>
              <div><b>L’Association des Maires de France soutient la démarche.</b></div>
            </div>
          </div>
        </div>

        <Notification style={{margin: '2em 0 -1em 0'}}>
          <div className='notification-content'>
            <div>
              <HelpCircle style={{verticalAlign: 'bottom', marginRight: '4px'}} alt aria-hidden='true' />
              Vous êtes une commune et souhaitez mettre en place une Base Adresse Locale à l’aide d’outils existants ?
            </div>
            <ButtonLink href='/gerer-mes-adresses'>
              Créer une Base Adresse Locale
            </ButtonLink>
          </div>
        </Notification>
      </Section>

      <Section background='color' title='Qu’est-ce que le format BAL ?'>
        <SectionText color='secondary'>
          <p>L’<a href='http://www.aitf.fr/'>Association des Ingénieurs Territoriaux de France</a> (AITF) a créé en avril 2015 un groupe de travail portant sur la Base Adresse Nationale.</p>
          <p>Les <a href='https://aitf-sig-topo.github.io/voies-adresses/'>travaux de ce groupe</a> ont abouti à la <a href='https://aitf-sig-topo.github.io/voies-adresses/files/AITF_SIG_Topo_Format_Base_Adresse_Locale_v1.3.pdf'>spécification d’un format d’échange</a>, aujourd’hui en version 1.3.</p>
          <p>Le format <b>BAL</b> est aujourd’hui le format d’échange à privilégier pour les données Adresse produites localement.</p>
        </SectionText>
        <div className='action'>
          <ButtonLink
            href='/bases-locales/validateur'
            isOutlined
            color='white'
          >
            Valider vos données au format BAL <CheckSquare style={{verticalAlign: 'middle', marginLeft: '3px'}} alt aria-hidden='true' />
          </ButtonLink>
        </div>
      </Section>

      <Section title='Adoptez la Charte de la Base Adresse Locale et rejoignez les organismes partenaires'>
        <SectionText>
          La Charte de la Base Adresse Locale rassemble les organismes qui privilégient le format <b>Base Adresse Locale</b> et s’engagent en matière de gouvernance. L’enjeu pour la communes, autorité responsable de l’adresse, est d’identifier un référent en capacité de l’assister au besoin. Les organismes partenaires présentent <b>la Charte</b> sur leur site Internet.
        </SectionText>
        <div className='centered'>
          <ButtonLink
            href='/bases-locales/charte'
          >
            Découvrir la charte
          </ButtonLink>
        </div>
        <div className='organismes-container'>
          <h3>Quelques partenaires :</h3>
          <Partners shuffledPartners={shuffledPartners} />
        </div>
        <div className='centered'>
          <ButtonLink href='/bases-locales/charte#partenaires'>
            Voir tous les partenaires
          </ButtonLink>
        </div>
      </Section>

      <Section background='color' title='État du déploiement des Bases Adresses Locales'>
        <MapBalSection stats={stats} />
      </Section>

      <style jsx>{`
        .notification-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 1em;
        }

        .parters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-content: space-around;
          margin: 2em 0;
          align-items: center;
          grid-gap: 1em;
        }

        .partner {
          display: grid;
          grid-template-rows: 1fr 1fr;
        }

        .explorateur-button-container {
          text-align: center;
        }

        .bal-grid {
          display: grid;
          grid-row-gap: 4em;
          margin: 4em 0;
        }

        .action {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          margin-top: 3em;
        }

        .button-link {
          margin: 0.5em 0;
        }

        .centered {
          margin-top: 6em;
          display: flex;
          justify-content: center;
        }

        .organismes-container{
          text-align: center;
          margin-top: 4em;
        }

        a {
          text-align: center;
        }
      `}</style>
    </div>
  )
})

BasesLocales.propTypes = {
  stats: PropTypes.object.isRequired
}

export default BasesLocales
