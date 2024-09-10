import { Footer as FooterDSFR } from '@codegouvfr/react-dsfr/Footer'
import { Follow } from '@codegouvfr/react-dsfr/Follow'
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display'

export default function Footer() {
  return (
    <>
      <Follow
        newsletter={{
          buttonProps: {},
          desc: 'Recevez toutes les informations de la base adresse nationale !',
          form: {
            formComponent: ({ children }) => <form action="">{children}</form>,
            success: false,
          },
        }}
        social={{
          buttons: [
            {
              linkProps: {
                href: 'https://x.com/adressedatagouv?lang=fr',
                target: '_blank',
              },
              type: 'twitter-x',
            },
            {
              linkProps: {
                href: 'https://www.linkedin.com/company/base-adresse-nationale/',
                target: '_blank',
              },
              type: 'linkedin',
            },
            {
              linkProps: {
                href: 'https://github.com/BaseAdresseNationale',
                target: '_blank',
              },
              type: 'github',
            },
          ],
        }}
      />
      <FooterDSFR
        brandTop={(
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        )}
        accessibility="non compliant"
        operatorLogo={{
          alt: '[À MODIFIER - texte alternatif de l’image]',
          imgUrl: '/logo-ban-site.svg',
          orientation: 'vertical',
        }}
        contentDescription={(
          <>
            Adresse<b>.data.gouv</b><i>.fr</i> &nbsp;-&nbsp; Le site national officiel de l’adresse. <br />
            Service public gratuit pour référencer l’intégralité des adresses du
            territoire et les rendre utilisables par tous. Retrouvez-y toutes
            les informations et démarches administratives nécessaires à la
            création et à la gestion des adresses.
          </>
        )}
        homeLinkProps={{
          href: '/',
          title: 'Adresse.data.gouv.fr - Accueil',
        }}
        accessibilityLinkProps={{
          href: '/accessibilite',
        }}
        termsLinkProps={{
          href: '/mentions-legales',
        }}
        bottomItems={[
          {
            text: 'CGU',
            linkProps: { href: '/cgu' },
          },
          {
            text: 'Statistiques',
            linkProps: { href: '/stats' },
          },
          {
            text: 'Contact',
            linkProps: { href: '/nous-contacter' },
          },
          {
            text: 'Documentation',
            linkProps: {
              href: 'https://doc.adresse.data.gouv.fr/',
              target: '_blank',
            },
          },
          {
            text: 'Supervision BAN/BAL',
            linkProps: {
              href: 'https://status.adresse.data.gouv.fr/',
              target: '_blank',
            },
          },
          headerFooterDisplayItem,
        ]}
      />
    </>
  )
}
