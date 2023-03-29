import Link from 'next/link'
import {Footer as FooterDsfr} from '@codegouvfr/react-dsfr/Footer'
import {Button} from '@codegouvfr/react-dsfr/Button'
import {createModal} from '@codegouvfr/react-dsfr/Modal'
import {fr} from '@codegouvfr/react-dsfr'

const {NewsLetterModal, newsLetterModalButtonProps} = createModal({
  name: 'newsLetter',
  isOpenedByDefault: false
})

function Footer() {
  return (
    <>
      <NewsLetterModal
        title='Inscription à l’infolettre'
        iconId='ri-file-list-3-fill'
      >
        <iframe height='580' width='100%' src='https://8d772127.sibforms.com/serve/MUIEALrUjwg3nxBK1Ebb_ndriJHjVhfoNqqr55eXe4id-Y3eYMbnHY6fabW8qNi5S55CjKgwWuwYbpWbQamoes1zxUi4vYJGeXwkygSrYFFz0Yg644JK8Bb2VY1Q23vp4b22CmKNIWbjSccP3x1RTOsdV3EjJkWc_o-mXUxWg9Hjx8gbmzkyUeSgKAinMeoI33kqpDssnQxeeorN' />
      </NewsLetterModal>

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
                    <Button className={fr.cx('fr-btn', 'ri-file-list-3-fill')} title='Infolettre d’Adresse.data.gouv.fr' {...newsLetterModalButtonProps}>
                      Infolettre
                    </Button>
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
          Adresse<b>.data.gouv</b><i>.fr</i> &nbsp;-&nbsp; Le site national officiel de l’adresse. <br />
          Service public gratuit pour référencer l’intégralité des
          adresses du territoire et les rendre utilisables par tous.
          Retrouvez-y toutes les informations et démarches
          administratives nécessaires à la création et à la gestion des adresses.
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
        bottomItems={[
          {
            text: 'Indicateurs d’impact',
            linkProps: {href: '/indicateurs'}
          },
          {
            text: 'Contact',
            linkProps: {href: '/nous-contacter'}
          },
          {
            text: 'Documentation',
            linkProps: {href: 'https://doc.adresse.data.gouv.fr/', target: '_blank'}
          },
          {
            text: 'Supervision BAN/BAL',
            linkProps: {href: 'https://status.adresse.data.gouv.fr/', target: '_blank'}
          },
          {
            text: 'Github',
            linkProps: {href: 'https://github.com/BaseAdresseNationale', target: '_blank', className: fr.cx('ri-github-fill')}
          },
        ]}
      />
    </>
  )
}

export default Footer
