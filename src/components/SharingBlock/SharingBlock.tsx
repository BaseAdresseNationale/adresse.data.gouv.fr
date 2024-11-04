'use client'

import Button from '@codegouvfr/react-dsfr/Button'
import type { ButtonProps } from '@codegouvfr/react-dsfr/Button'

import { SharingDefList } from './SharingBlock.styled'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

interface MastodonShareEvent extends Event {
  target: EventTarget & {
    getAttribute(attributeName: string): string | null
  }
}

function MastodonShare(content: string, navigatorPageName = 'mastodon') {
  try {
    // Controle if content is not empty
    if (!content) {
      throw new Error('Content is empty')
    }

    // Get the Mastodon domain
    // TODO: Prefer DSFR Modal for the prompt
    const mastodonDomain = prompt('Votre Domain Mastodon ?', 'mastodon.social')

    // TODO: Add a check for the Mastodon domain
    if (!mastodonDomain) {
      return
    }

    // Build the sharing URL
    const url = `https://${mastodonDomain}/share?text=${content}`

    // Open a window on the share page
    window.open(url, navigatorPageName)
  }
  catch (error) {
    console.error(error)
  }
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
      iconId: 'fr-icon-mastodon-line',
      onClick: () => MastodonShare(`${title};url=${pageUrl}`),
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
      onClick: () => { navigator.clipboard.writeText(pageUrl) },
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
