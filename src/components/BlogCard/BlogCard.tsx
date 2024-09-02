import Card from '@codegouvfr/react-dsfr/Card'
import Tag from '@codegouvfr/react-dsfr/Tag'

export interface PostItem {
  title: string
  excerpt: string
  feature_image: string
  slug: string
  link: string
  tags: { name: string }[]
}

interface BlogCardProps {
  post: PostItem
}

function BlogCard({ post }: BlogCardProps) {
  const {
    title,
    excerpt: description,
    feature_image: picto,
    slug,
    link,
    tags = [],
  } = post

  return (
    <Card
      key={title}
      imageAlt="texte alternatif de l’image"
      imageUrl={picto}
      linkProps={{ href: `/blog/${slug}` }}
      title={title}
      desc={description}
      start={
        tags.length && (
          <ul className="fr-tags-group">
            {tags.map(({ name }) => (
              <li key={name}>
                <Tag small>{name}</Tag>
              </li>
            ))}
          </ul>
        )
      }
      endDetail={<i>Lire la suite...</i>}
      enlargeLink
    />
  )
}

export default BlogCard
