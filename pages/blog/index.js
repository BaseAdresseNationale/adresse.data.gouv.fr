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
      <Head title='Le Blog de L’Adresse' icon={<Book size={56} alt aria-hidden='true' />} />
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
                          <div className='tag'> {getTagName(tag)} <X size='15' style={{verticalAlign: 'middle'}} alt aria-hidden='true' /></div>
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
            <h5>Le blog est actuellement inaccessible</h5>
            <p><i>Merci de réessayer ulterieurement</i></p>
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
