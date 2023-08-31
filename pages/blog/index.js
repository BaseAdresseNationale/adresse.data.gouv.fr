import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Book, X} from 'react-feather'

import {getPosts, getTags} from '../../lib/blog'

import colors from '@/styles/colors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Button from '@/components/button'
import BlogCard from '@/components/blog-card'
import Notification from '@/components/notification'
import BlogPagination from '@/components/blog-pagination'
import ActionButtonNeutral from '@/components/action-button-neutral'

function BlogIndex({posts, pagination, tags, tagsList}) {
  const router = useRouter()
  // Display tag.name instead of tag.slug in tag list
  const getTagName = tag => tagsList.find(t => t.slug === tag)?.name || tag

  const addTag = tag => {
    if (!tags.includes(tag.slug)) {
      router.push(`/blog?tags=${[...tags, tag.slug]}`)
    }
  }

  const removeTag = tag => {
    if (tags.length === 1) {
      resetTags()
    } else {
      router.push(`/blog?tags=${tags.filter(t => t !== tag)}`)
    }
  }

  const resetTags = () => {
    router.push('/blog')
  }

  return (
    <Page title='Le Blog de L’Adresse'>
      <Head title='Le Blog de L’Adresse' icon={<Book size={56} alt='' aria-hidden='true' />} />
      <div className='partners-testimony-map'>
        <h3>Carte des témoignages</h3>
        <iframe width='80%' height='400px' src='https://umap.openstreetmap.fr/fr/map/carte-des-temoignages_953200?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=caption&captionBar=false&captionMenus=false' />
        <a href='https://umap.openstreetmap.fr/en/map/carte-des-temoignages_953200#6/46.149/8.240' target='_blank' rel='noreferrer'>Voir en plein écran</a>
      </div>
      <Section>
        {posts ? (
          <>
            {tags?.length > 0 && (
              <div className='tag-infos-container'>
                <div className='tag-infos'>
                  <span>Liste des articles contenant le mot-clé :</span>
                  <div className='tags-container'>
                    <div className='tags-list'>
                      {tags.map(tag => (
                        <ActionButtonNeutral
                          label={`Supprimer le tag ${getTagName(tag)}`}
                          key={tag} className='tag'
                          onClick={() => removeTag(tag)}
                        >
                          <div className='tag'> {getTagName(tag)} <X size='15' style={{verticalAlign: 'middle'}} alt='' aria-hidden='true' /></div>
                        </ActionButtonNeutral>
                      ))}
                    </div>
                    <Button onClick={resetTags} size='small' style={{float: 'right'}}>Voir tous les articles</Button>
                  </div>
                </div>
              </div>
            )}
            <div className='blog-section'>
              {posts.map(post => (
                <BlogCard key={post.id} post={post} onClick={addTag} />
              ))}
            </div>
            <BlogPagination {...pagination} />
          </>
        ) : (
          <Notification>
            <div className='inaccessible'>
              <div>Le blog est actuellement inaccessible</div>
              <p><i>Merci de réessayer ulterieurement</i></p>
            </div>
          </Notification>
        )}
      </Section>

      <style jsx>{`
        .blog-section {
          padding-top: 1em;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          grid-gap: 3em 5em;
        }

        .inaccessible {
          text-align: center;
        }

        .inaccessible div:first-child {
          font-weight: bold;
          font-size: large;
        }

        .tag-infos-container {
          margin-bottom: 1em;
          border-bottom: 1px solid ${colors.lighterGrey};
        }

        .tags-list {
          display: flex;
          flex-flow: wrap;
        }

        .tag-infos {
          font-weight: bolder;
          font-size: 1.2em;
        }

        .tags-container {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          margin-bottom: .5em;
        }

        .tag {
          background-color: ${colors.lighterBlue};
          border-radius: 15px;
          padding: 5px 10px;
          margin: 3px;
          font-weight: bold;
          font-style: italic;
          text-decoration: underline;
          color: ${colors.blue}
        }

        .tag:hover {
          background-color: ${colors.lightRed};
        }

        .partners-testimony-map {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .partners-testimony-map h3 {
          margin: 1em;
        }

        .partners-testimony-map a {
          align-self: flex-start;
          margin-left: 10%;
          margin-top: 1em;
          font-size: 1.2em;
          font-weight: bold;
          color: var(--theme-primary);
        }
      `}</style>
    </Page>
  )
}

BlogIndex.propTypes = {
  posts: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  tagsList: PropTypes.array.isRequired
}

export async function getServerSideProps({query}) {
  const data = await getPosts(query)
  const tags = query?.tags || null
  const tagsList = await getTags()

  return {
    props: {
      posts: data?.posts || null,
      pagination: data?.meta.pagination || null,
      tags: tags?.split(',') || [],
      tagsList
    }
  }
}

export default BlogIndex
