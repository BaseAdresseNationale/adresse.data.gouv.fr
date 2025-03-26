'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import { toast } from 'react-toastify'
import type { ButtonProps } from '@codegouvfr/react-dsfr/Button'

import { SharingDefList } from './SharingBlock.styled'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

const mastodonShare = (content: string, navigatorPageName = 'mastodon') => {
  try {
    if (!content) throw new Error('Content is empty')

    // Get the Mastodon domain
    // TODO: Prefer DSFR Modal for the prompt
    const mastodonDomain = prompt('Votre Domain Mastodon ?', 'mastodon.social')
    // TODO: Add a check for the Mastodon domain
    if (!mastodonDomain) return

    const url = `https://${mastodonDomain}/share?text=${content}`
    window.open(url, navigatorPageName)
  }
  catch (error) {
    console.error(error)
  }
}

const copyUrlToClipboard = (url: string | URL) => {
  navigator.clipboard.writeText(url as string)
  toast(`URL copiée dans le presse-papier (${url})`)
}

const ShareButton = (buttonProps: ButtonProps) => (
  <Button
    priority="tertiary"
    {...buttonProps}
  />
)

function SharingBlock({ pageUrl, callMessage, title }: { pageUrl: string, callMessage: string, title: string }) {
  const shareingPlateform = [
    {
      iconId: 'ri-bluesky-line',
      linkProps: {
        href: `https://bsky.app/intent/compose?text=${callMessage}%20${pageUrl}`,
        target: '_blank',
      },
      title: 'Partager sur Bluesky',
    },
    {
      iconId: 'fr-icon-facebook-circle-line',
      linkProps: {
        href: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
        target: '_blank',
      },
      title: 'Partager sur Facebook',
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
      iconId: 'fr-icon-mastodon-line',
      onClick: () => mastodonShare(`${title};url=${pageUrl}`),
      title: 'Partager sur Mastodon',
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
      onClick: () => { copyUrlToClipboard(pageUrl) },
      title: 'Copier le lien',
    },
  ]

  return (
    <SharingDefList>
      <dt>Partager la page</dt>
      {shareingPlateform.map(({ title, ...ShareButtonProps }) => (
        <dd key={title}>
          <Tooltip
            kind="hover"
            title={title}
          >
            <ShareButton {...(ShareButtonProps as ButtonProps)} />
          </Tooltip>
        </dd>
      ))}
    </SharingDefList>
  )
}

export default SharingBlock
