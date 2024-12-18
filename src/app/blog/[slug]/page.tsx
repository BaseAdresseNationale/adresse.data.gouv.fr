import { Fragment } from 'react'
import Tag from '@codegouvfr/react-dsfr/Tag'

import Breadcrumb from '@/layouts/Breadcrumb'
import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import ResponsiveImage from '@/components/ResponsiveImage'
import { getSinglePost } from '@/lib/blog'

import {
  TagsWrapper,
  PublicationWrapper,
  ImageWrapper,
  AuthorWrapper,
  TextWrapper,
} from './page.styled'

import AsideContent from './components/AsideContent'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const pageUrl = `https://adresse.data.gouv.fr/blog/${params.slug}`
  const blogPost = await getSinglePost(params.slug) || {}

  const {
    excerpt,
    html: contentHtml,
    title,
    tags,
    feature_image: featureImage,
    authors,
    published_at: publishedAt,
    reading_time: readingTime,
  } = blogPost || {}

  return (
    <>
      <Breadcrumb
        currentPageLabel={title}
        segments={[
          {
            label: 'Le Blog et les témoignages',
            linkProps: {
              href: '/blog',
            },
          },
        ]}
      />
      <Section>
        <TextWrapper>
          <header>
            <TagsWrapper>
              {tags.length && (
                <ul className="fr-tags-group">
                  {tags.map(({ name }: { name: string }) => (
                    <li key={name}>
                      <Tag small>{name}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </TagsWrapper>

            <h1>{title}</h1>
          </header>
        </TextWrapper>

        <TextWrapper>
          <article>
            <hr />

            <PublicationWrapper>
              {publishedAt && <div className="publication-date">Publié le {new Date(publishedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
              {readingTime && <div className="reading-time">Lecture {readingTime} minutes</div>}
            </PublicationWrapper>

            <p>
              {excerpt}
            </p>
            {featureImage && (
              <ImageWrapper>
                <ResponsiveImage src={featureImage} alt={title} />
              </ImageWrapper>
            )}

            <AuthorWrapper>
              <div>Rédigé par{authors?.length && ((authors as { name: string }[]).map(({ name }, i, arr) => (
                <Fragment key={name}>{arr.length > 1 && i === (arr.length - 1) ? ' et' : (i > 0 ? ' ,' : ' ')} <span>{name}</span></Fragment>)))}
              </div>
            </AuthorWrapper>

            <HtmlViewer html={contentHtml} />
          </article>
          <aside>
            <AsideContent />
          </aside>
        </TextWrapper>
      </Section>
    </>
  )
}
