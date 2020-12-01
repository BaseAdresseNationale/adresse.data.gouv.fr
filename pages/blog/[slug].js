import React from 'react'
import {getSinglePost} from '../../ghost/posts'
import {Rss, ArrowLeft} from 'react-feather'

import Page from '../../layouts/main'
import Section from '../../components/section'
import Head from '../../components/head'
import ButtonLink from '../../components/button-link'

import colors from '../../styles/colors'

const Slug = props => {
  const styleImg = 'style="width: 100%; height: auto; margin: auto;"'
  const post = props.post

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
              __html: post.html.replaceAll('<img ', `<img ${styleImg} `)
            }}
          />
          <ButtonLink href='/blog' isOutlined>
            <ArrowLeft style={{marginRight: '5px', verticalAlign: 'middle'}} /> Retour
          </ButtonLink>
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

Slug.getInitialProps = async params => {
  const post = await getSinglePost(params.query.slug)
  return {post}
}

export default Slug
