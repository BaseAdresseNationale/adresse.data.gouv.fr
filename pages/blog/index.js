import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Book, X} from 'react-feather'

import {getPosts} from '../../lib/blog'

import colors from '@/styles/colors'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Button from '@/components/button'
import BlogCard from '@/components/blog-card'
import Notification from '@/components/notification'

function BlogIndex({posts}) {
  const [filters, setFilters] = useState([])
  const [filteredPosts, setFilteredPosts] = useState(posts)

  const addTag = useCallback(tag => {
    if (!filters.includes(tag)) {
      setFilters([...filters, tag])
    }
  }, [filters])

  const removeTag = tag => {
    setFilters(filters.filter(t => t !== tag))
  }

  const resetFilter = () => {
    setFilteredPosts(posts)
    setFilters([])
  }

  useEffect(() => {
    if (posts) {
      const filteredPosts = posts.filter(post => (
        filters.every(f => (
          post.tags.some(tag => (
            tag.name === f))
        ))
      ))

      setFilteredPosts(filteredPosts)
    }
  }, [filters, posts])

  return (
    <Page title='Le Blog de L’Adresse'>
      <Head title='Le Blog de L’Adresse' icon={<Book size={56} />} />
      <Section>
        {filteredPosts ? (
          <>
            {filters.length > 0 && (
              <div className='tag-infos-container'>
                <p className='tag-infos'>Liste des articles contenant le mot-clé :</p>
                {filters.map(filter => (
                  <span key={filter} className='tag' onClick={() => removeTag(filter)}>
                    {filter} <X size='15' style={{verticalAlign: 'middle'}} />
                  </span>
                ))}
                <Button onClick={() => resetFilter()} size='small' style={{float: 'right'}}>Voir tous les articles</Button>
              </div>
            )}
            <div className='blog-section'>
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} onClick={addTag} />
              ))}
            </div>
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
          text-align: center;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          grid-column-gap: 6em;
        }

        .tag-infos-container {
          border-bottom: 1px solid ${colors.lighterGrey};
          padding-bottom: .5em;
        }

        .tag-infos {
          font-weight: bolder;
          font-size: 1.2em;
        }

        .tag {
          background-color: ${colors.lighterBlue};
          border-radius: 15px;
          padding: 2px 10px;
          margin: 3px;
          font-size: .8em;
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

BlogIndex.defaultProps = {
  posts: null
}

BlogIndex.propTypes = {
  posts: PropTypes.array
}

export async function getServerSideProps() {
  const posts = await getPosts()
  return {
    props: {
      posts
    }
  }
}

export default BlogIndex
