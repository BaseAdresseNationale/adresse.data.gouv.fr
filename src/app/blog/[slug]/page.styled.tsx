'use client'

import styled from 'styled-components'

const ARTICLE_MARGIN_LEFT = '7rem'

export const TagsWrapper = styled.div`
  padding: 0 0 1rem 0;
`

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;

    header,
    article {
      padding: 0;
      width: auto;
    }

    aside {
      hr {
        width: 10%;
      }
    }

    figure {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      max-width: calc(100vw - 1.5rem - 1.5rem);
      margin: 2rem 15%;
      font-size: 1rem;

      img {
        max-width: 100%;
        height: auto;
        border-radius: 1rem;
      }

      figcaption {
        font-size: 0.75em;
        text-align: center;
        margin-top: 0.5em;
        color: #666666;
      }
    }

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
      flex-direction: row;

      header,
      article {
        width: 70%;
        padding-left: ${ARTICLE_MARGIN_LEFT};
      }

      aside {
        width: 30%;
        min-width: 230px;
      }
    }
`
export const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    max-height: 25rem;
    overflow: hidden;
    margin: 2rem -2rem;

    box-shadow: 0 0 0.3rem rgba(0,0,0,0.1);

    img {
      width: 100%;
      height: auto;
    }

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
      margin: 2rem 0 2rem -${ARTICLE_MARGIN_LEFT};
    }
`

export const PublicationWrapper = styled.div`
  display: flex;
  padding: 0 0 1.5rem 0;
  font-size: 0.85em;

  .publication-date {
    font-weight: bold;
  }

  .reading-time {
    flex: 1;
    text-align: right;
  }
`

export const AuthorWrapper = styled.div`
  padding: 0 0 1.5rem 0;
  font-size: 0.85em;
  font-weight: bold;
`
