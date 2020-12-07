import React from 'react'
import {getSinglePost, getPosts} from '../../ghost/posts'
import {Rss, ArrowLeft} from 'react-feather'
import {format} from 'date-fns'

import Page from '../../layouts/main'
import Section from '../../components/section'
import Head from '../../components/head'
import ButtonLink from '../../components/button-link'

import colors from '../../styles/colors'

const Slug = props => {
  const styleImg = 'style="width: 100%; height: auto; margin: auto;"'
  const {post} = props

  if (post) {
    return (
      <Page>
        <Head title='Actualités' icon={<Rss size={56} />} />
        <Section background='grey' title={post.title} subtitle={post.excerpt}>
          <div className='image'>
            <img src={post.feature_image} />
          </div>
          <div
            className='dangerous-html'
            dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
              __html: post.html.replace(/<img/g, `<img ${styleImg} `)
            }}
          />
          <div className='article-footer'>
            <div>
              <ButtonLink href='/blog' isOutlined>
                <ArrowLeft style={{marginRight: '5px', verticalAlign: 'middle'}} /> Retour
              </ButtonLink>
            </div>
            <div>
              <span><i>Article publié le</i> <b>{format(new Date(post.created_at), 'dd/MM/yyyy')}</b></span>
              <span><i>par</i> <b>{post.authors[0].name}</b></span>
              <span><b>- <i>{post.authors[0].bio}</i> -</b></span>
            </div>
          </div>
        </Section>
        <style jsx>{`
          div {
            margin: 1em;
            padding: 1em;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .dangerous-html {
            margin: auto;
            font-size: 1.2em;
          }

          .image {
            width: 100%;
            margin: auto;
            padding: 1.5em;
            border-bottom: 1px solid ${colors.grey};
          }

          .article-footer {
            flex-direction: row;
            justify-content: space-between;
            margin: auto;
          }

          @media (max-width: 950px) {
            .dangerous-html {
              padding: .3em;
            }
        }
      `}</style>
      </Page>
    )
  }
}

export async function getStaticPaths() {
  const posts = await getPosts()
  if (posts) {
    const paths = posts.map(post => ({
      params: {slug: post.slug}
    }))

    return {paths, fallback: false}
  }

  return {paths: [], fallback: false}
}

export async function getStaticProps(params) {
  const post = await getSinglePost(params.params.slug)
  if (post) {
    return {
      props: {post},
      revalidate: 1
    }
  }

  return {notFound: true}
}

export default Slug
