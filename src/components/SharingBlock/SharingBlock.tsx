'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import type { ButtonProps } from '@codegouvfr/react-dsfr/Button'

import { SharingDefList } from './SharingBlock.styled'

const ShareButton = (buttonProps: ButtonProps) => (
  <Button
    priority="tertiary"
    {...buttonProps}
  />
)

function SharingBlock({ pageUrl, callMessage, title }: { pageUrl: string, callMessage: string, title: string }) {
  const shareingPlateform = [
    {
      iconId: 'fr-icon-facebook-circle-line',
      linkProps: {
        href: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
        target: '_blank',
      },
      title: 'Partager sur Facebook',
    },
    {
      iconId: 'fr-icon-twitter-x-line',
      linkProps: {
        href: `http://x.com/share?text=${callMessage}&url=${pageUrl}`,
        target: '_blank',
      },
      title: 'Partager sur X.com (ex Twitter)',
    },
    {
      iconId: 'fr-icon-threads-line',
      linkProps: {
        href: `https://threads.net/intent/post?text=${callMessage}&url=${pageUrl}`,
        target: '_blank',
      },
      title: 'Partager sur Threads',
    },
    {
      iconId: 'fr-icon-linkedin-box-line',
      linkProps: {
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${callMessage}&summary=My%20favorite%20developer%20program&source=LinkedIn`,
        target: '_blank',
      },
      title: 'Partager sur LinkedIn',
    },
    {
      iconId: 'fr-icon-mail-line',
      linkProps: {
        href: `mailto:?body=${encodeURI(callMessage + '\n\n' + pageUrl)}&subject=${encodeURI(`A lire sur le site de l’Adresse : ${title}`)}`,
        target: '_blank',
      },
      title: 'Partager par E-Mail',
    },
    {
      iconId: 'fr-icon-links-line',
      onClick: () => { navigator.clipboard.writeText(pageUrl) },
      title: 'Copier le lien',
    },
  ]

  return (
    <SharingDefList>
      <dt>Partager la page</dt>
      {shareingPlateform.map(ShareButtonProps => (
        <dd key={ShareButtonProps.title}>
          <ShareButton {...(ShareButtonProps as ButtonProps)} />
        </dd>
      ))}
    </SharingDefList>
  )
}

export default SharingBlock
