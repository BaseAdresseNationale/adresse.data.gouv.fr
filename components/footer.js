import Link from 'next/link'
import {Footer as FooterDsfr} from '@codegouvfr/react-dsfr/Footer'
import {fr} from '@codegouvfr/react-dsfr'

function Footer() {
  return (
    <>
      <div className='fr-follow'>
        <div className='fr-container'>
          <div className='fr-grid-row'>
            <div className='fr-col-12'>
              <div className='fr-follow__social'>
                <h2 className='fr-h5'>Suivez et participez
                  <br />à l’actualité de la communauté adresse.data.gouv
                </h2>
                <ul className='fr-btns-group'>
                  <li>
                    <Link className='fr-btn--twitter fr-btn' href='https://twitter.com/adressedatagouv?lang=fr' target='_blank' title='Le fil twitter d’adresse.data.gouv.fr - Nouvelle fenêtre' rel='noreferrer'>
                      twitter
                    </Link>
                  </li>
                  <li>
                    <Link className='fr-btn--linkedin fr-btn' href='https://www.linkedin.com/company/base-adresse-nationale/' target='_blank' title='LinkedIn de la Base Adresse Nationale - nouvelle fenêtre'>
                      linkedin
                    </Link>
                  </li>
                  <li>
                    <Link className={fr.cx('fr-btn', 'ri-quill-pen-fill')} href='/blog' title='Blog d’Adresse.data.gouv.fr'>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link className={fr.cx('fr-btn', 'ri-file-list-3-fill')} href='/blog' title='Infolettre d’Adresse.data.gouv.fr'>
                      Infolettre
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterDsfr
        accessibility='non compliant'
        brandTop={<>République<br />française</>}
        contentDescription={<>
          Adresse<b>.data.gouv</b><i>.fr</i>, <br />Le site officiel des adresses.
          Retrouvez toutes les informations et démarches administratives nécessaires
          à la création et à la gestion des adresses.
        </>}
        homeLinkProps={{
          href: '/',
          title: 'Adresse.data.gouv.fr - Accueil'
        }}
        accessibilityLinkProps={{
          href: '/accessibilite'
        }}
        termsLinkProps={{
          href: '/cgu'
        }}
      />
    </>
  )
}

export default Footer
