import React from 'react'
import PropTypes from 'prop-types'
import {getPosts} from '../../ghost/posts'
import {format} from 'date-fns'
import Link from 'next/link'
import {Rss} from 'react-feather'

import Page from '../../layouts/main'
import Section from '../../components/section'
import Head from '../../components/head'

import theme from '../../styles/theme'
import colors from '../../styles/colors'

const Blog = props => {
  return (
    <Page>
      <Head title='Actualités' icon={<Rss size={56} />} />
      <Section>
        <div className='articles-list'>
          {props.posts.map(post => (
            <div className='article' key={post.id}>
              <div>
                <div>
                  <Link href='/blog/[slug]' as={`/blog/${post.slug}`}>
                    <div className='article-img' style={{backgroundImage: `url(${post.feature_image})`}} />
                  </Link>
                </div>
              </div>
              <Link href='/blog/[slug]' as={`/blog/${post.slug}`}>
                <a className='title'>
                  {post.title}
                </a>
              </Link>
              <div className='resume'>
                <div className='date'>
                  {format(new Date(post.created_at), 'dd/MM/yyyy')}
                </div>
                <div>
                  <p>{post.excerpt}</p>
                </div>
                <div>
                  <Link href='/blog/[slug]' as={`/blog/${post.slug}`}>
                    <a>Lire la suite</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <style jsx>{`
        .date {
          font-size: 1em;
          color: ${colors.darkerGrey};
        }

        .title {
          color: black;
          text-decoration: none;
          padding: .5em;
          font-size: 1.5em;
          font-weight: bolder;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .resume {
          width: 80%;
          height: auto;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .articles-list {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          grid-column-gap: 2em;
          grid-row-gap: 2em;
          justify-content: center;
        }

        .article-img {
          border-radius: 8px 8px 0px 0px;
          padding: 0;
          height: 250px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .article-img:hover {
          cursor: pointer;
        }

        .article {
          width: 100%;
          display: flex;
          padding-bottom: 1em;
          flex-direction: column;
          text-align: center;
          justify-content: space-between;
          border: 1px solid ${theme.boxShadow};
          box-shadow: 1px 1px 3px ${theme.boxShadow};
          border-radius: 8px;
        }

        @media (max-width: 950px) {
          .articles-list {
            grid-template-columns: repeat(1 ,minmax(0,1fr));
          }
        }
      `}</style>
    </Page>
  )
}

export async function getStaticProps() {
  const posts = await getPosts()
  if (posts) {
    return {props: {posts}}
  }

  return {notFound: true}
}

Blog.propTypes = {
  posts: PropTypes.array
}

Blog.defaultProps = {
  posts: null
}

export default Blog
