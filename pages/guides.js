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
            Pour vous accompagner dans la <b>gestion des adresses</b> de votre commune, vous trouverez sur cette page des <b>guides régulièrement mis à jour</b>.
          </p>
          <p>
            Placés sous le régime de la <b><i>licence ouverte</i></b>, ils sont <b>diffusables</b> et <b>réutilisables</b> sans restriction.
          </p>
          <p>
            Pour être tenu informé des mises à jour ou suggérer des évolutions, n’hésitez-pas à <Link href='/nous-contacter'>nous contacter</Link>.
          </p>
        </div>
      </Section>
      <Section background='grey'>
        <div className='align'>
          <div className='resume'>
            <h3>Le guide de l’éditeur de Base Adresse Locale</h3>
            <p>
              Un outil en ligne vous permettre de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. <br />Il est accessible sans compétences techniques.
            </p>
          </div>
          <div className='img-container'>
            <img src='/images/previews/guide-bases-locales-preview.png' alt='Couverture du Guides Bases Locales' />
            <div className='link'>
              <Link href='https://adresse.data.gouv.fr/data/docs/20200923%20Guide%20éditeur%20Base%20Adresse%20Locale%201.2.pdf'>
                <a>
                  <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
                  Télécharger le guide
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className='align reverse'>
          <div className='img-container'>
            <img src='/images/previews/bonnes-pratiques-preview.png' alt='Couverture du Guides des bonnes pratiques' />
            <div className='link'>
              <Link href='https://adresse.data.gouv.fr/data/docs/20200923%20Bonnes%20pratiques%20de%20l%27adresse.pdf'>
                <a>
                  <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
                  Télécharger le guide
                </a>
              </Link>
            </div>
          </div>
          <div className='resume'>
            <h3>Le guide des bonnes pratiques</h3>
            <p>
              Les communes sont responsables de leurs adresses. <br /> Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.
            </p>
          </div>
        </div>
      </Section>
      <Section title='En partenariat avec : '>
        <div style={{width: '100%', textAlign: 'center'}}>
          <img src='/images/logos/logo_ANCT.svg' alt='logo ANCT' />
        </div>
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
          width: 70%;
        }

        .img-container {
          position: relative;
          padding: 2em;
          width: 30%;
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

          .resume {
            width: 100%;
          }

          .img-container {
            width: 100%;
          }
        }
      `}</style>
    </Page>
  )
}

export default Guides
