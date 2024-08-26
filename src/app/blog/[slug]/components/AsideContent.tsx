import Link from 'next/link'

import { getPosts } from '@/lib/blog'

import { AsideLinkList, AsideFollowList } from './AsideContent.styled'

const {
  NEXT_PUBLIC_SOCIAL_NETWORKS_URL_XCOM: SOCIAL_NETWORKS_URL_XCOM,
  NEXT_PUBLIC_SOCIAL_NETWORKS_URL_FACEBOOK: SOCIAL_NETWORKS_URL_FACEBOOK,
  NEXT_PUBLIC_SOCIAL_NETWORKS_URL_LINKEDIN: SOCIAL_NETWORKS_URL_LINKEDIN,
} = process.env
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
        <li><Link className="fr-link fr-link--icon-left fr-icon-facebook-circle-fill" target="facebook" href={SOCIAL_NETWORKS_URL_FACEBOOK ?? ''}>Facebook</Link></li>
        <li><Link className="fr-link fr-link--icon-left ri-mail-send-fill" target="newsletter" href="#d">Newsletter</Link></li>
      </AsideFollowList>
    </>
  )
}

export default AsideContent
