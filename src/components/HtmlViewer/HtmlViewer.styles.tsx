'use client'

import styled from 'styled-components'

const ARTICLE_MARGIN_LEFT = '7rem'

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

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

    p {
      width: 100%;
    }

    a {
      /* From DSFR class : 'fr-link' */
      --text-spacing: 0;
      --title-spacing: 0;
      display: inline;
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 0;
      color: var(--text-action-high-blue-france);
    }

    pre {
      max-width: 100%;
      width: calc(100vw - 2rem - 2rem);
      margin: 0;
      padding: 1rem;
      overflow: auto;
      background: #efefef;
    }

    code {
      font-family: monospace;
      font-size: 0.9em;
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
