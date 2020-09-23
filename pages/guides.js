import React from 'react'
import Link from 'next/link'
import {Book} from 'react-feather'

import theme from '../styles/theme'

import Page from '../layouts/main'
import Head from '../components/head'
import Section from '../components/section'

const Guides = () => {
  return (
    <Page>
      <Head title='Guides de l’adressage' icon={<Book size={56} />} />
      <Section>
        <div className='sub-title'>
          <p>
            Pour vous accompagner dans votre <b>adressage</b>, vous trouverez sur cette page des <b>guides régulièrement mis à jour</b>.
          </p>
          <p>
            Placés sous le régime de la <b><i>licence ouverte</i></b>, ils sont <b>diffusables</b> et <b>réutilisables</b> sans restriction.
          </p>
          <p>
            Pour être tenu informé des mises à jour, adresser vos remarques, suggérer des évolutions, n’hésitez-pas à adresser un message à <a>adresse@data.gouv.fr</a>.
          </p>
        </div>
      </Section>
      <Section background='grey'>
        <section className='align'>
          <div className='resume'>
            <h3>Le Guide pour vous aider à modifier vos adresses en ligne</h3>
            <p>
              Un outil en ligne vous permet de créer votre Base Adresse Locale, de la modifier et de la publier. <br />Il est accessible sans compétence technique et ce guide vous permet d’utiliser directement les fonctionnalités qui vous intéressent.
            </p>
          </div>
          <div className='img-container'>
            <img src='/images/previews/guide-bases-locales-preview.png' />
            <div className='link'>
              <Link href='/data/docs/20200921%20Guide%20editeur%20Base%20Adresse%20Locale%201.2.pdf'>
                <a>
                  <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
                  Télécharger le Guide
                </a>
              </Link>
            </div>
          </div>
        </section>
      </Section>
      <Section>
        <section className='align reverse'>
          <div className='img-container'>
            <img src='/images/previews/bonnes-pratiques-preview.png' />
            <div className='link'>
              <Link href='/data/docs/20200921%20Bonnes%20pratiques%20de%20l%27adresse.pdf'>
                <a>
                  <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
                  Télécharger le Guide
                </a>
              </Link>
            </div>
          </div>
          <div className='resume'>
            <h3>Le Guide des bonnes pratiques à respecter</h3>
            <p>
              Les communes sont responsables de leurs adresses. <br /> Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.
            </p>
          </div>
        </section>
      </Section>
      <style jsx>{`
        .align {
          display: flex;
          justify-content: space-between;
        }

        .resume {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .img-container {
          position: relative;
          padding: 2em;
        }

        .img-container img {
          width: 100%;
          height: auto;
          max-width: 300px;
          border: 1px solid ${theme.border};
          display: flex;
          flex-direction: column;
          margin: auto;
        }

        .link {
          text-align: center;
          margin: .5em;
        }

        @media only screen and (max-width: 768px) {
          .align {
            flex-direction: column;
          }

          .reverse {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </Page>
  )
}

export default Guides
