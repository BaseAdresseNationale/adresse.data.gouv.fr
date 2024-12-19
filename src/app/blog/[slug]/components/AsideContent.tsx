import Link from 'next/link'

import { getPosts } from '@/lib/blog'

import { AsideLinkList, AsideFollowList } from './AsideContent.styled'
import { env } from 'next-runtime-env'

const SOCIAL_NETWORKS_URL_MASTODON = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_MASTODON')
const SOCIAL_NETWORKS_URL_FACEBOOK = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_FACEBOOK')
const SOCIAL_NETWORKS_URL_LINKEDIN = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_LINKEDIN')
const SOCIAL_NETWORKS_URL_GITHUB = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_GITHUB')
const SOCIAL_NETWORKS_URL_XCOM = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_XCOM')

const NB_HIGHLIGHTED_POSTS = 3

async function AsideContent() {
  const highlightedDatas = await getPosts({ limit: NB_HIGHLIGHTED_POSTS })

  return (
    <>
      <hr />
      <h6>Articles recents</h6>
      <AsideLinkList>
        {(highlightedDatas?.posts || []).map(({ title, slug }: { title: string, slug: string }) => (
          <li key={title}><Link className="fr-link" href={`/blog/${slug}`}>{title.replace(/\s!/, '\u00A0!')}</Link></li>
        ))}
      </AsideLinkList>
      <hr />
      <h6>Nous suivre</h6>
      <AsideFollowList>
        <li><Link className="fr-link fr-link--icon-left fr-icon-linkedin-box-fill" target="linkedin" href={SOCIAL_NETWORKS_URL_LINKEDIN ?? ''}>LinkedIn</Link></li>
        <li><Link className="fr-link fr-link--icon-left fr-icon-twitter-x-fill" target="twitter-x" href={SOCIAL_NETWORKS_URL_XCOM ?? ''}>X.com</Link></li>
        <li><Link className="fr-link fr-link--icon-left fr-icon-mastodon-fill" target="mastodon" href={SOCIAL_NETWORKS_URL_MASTODON ?? ''}>Mastodon</Link></li>
        <li><Link className="fr-link fr-link--icon-left ri-mail-send-fill" target="newsletter" href="#newsletter">Newsletter</Link></li>
        <li><Link className="fr-link fr-link--icon-left fr-icon-facebook-circle-fill" target="facebook" href={SOCIAL_NETWORKS_URL_FACEBOOK ?? ''}>Facebook</Link></li>
      </AsideFollowList>
    </>
  )
}

export default AsideContent
