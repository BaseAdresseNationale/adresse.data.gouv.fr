'use client'

import styled from 'styled-components'

const ARTICLE_MARGIN_LEFT = '7rem'

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

    img,
    video {
      max-width: 100%;
      height: auto;
      border-radius: 1rem;
      box-shadow: 0 0 1rem -0.7rem;
    }

    figure {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      max-width: calc(100vw - 1.5rem - 1.5rem);
      margin: 2rem 10%;
      font-size: 1rem;

      figcaption {
        font-size: 0.75em;
        text-align: center;
        margin-top: 0.5em;
        color: #666666;
      }
    }

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
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
