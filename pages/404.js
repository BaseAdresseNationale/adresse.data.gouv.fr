import React from 'react'

import theme from '@/styles/theme'

import Meta from '@/components/meta'
import Page from '@/layouts/main'

function ErrorPage() {
  return (
    <Page>
      <Meta title='Erreur 404' description='La page demandée n’a pas pu être trouvée' />

      <div>
        <section>
          <h1>Erreur 404</h1>
          <h2>La page demandée n’a pas pu être trouvée</h2>
        </section>
      </div>

      <style jsx>{`
        div {
          margin: 7em 15px 2em;
          text-align: center;
        }

        section {
          padding: 2em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
        }

        h1 {
          font-size: 24px;
          fontWeight: 500;
        }

        h2 {
          margin: 0;
          font-size: 14px;
          font-weight: normal;
        }

        @media (min-width: 552px) {
          div {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
          }

          section {
            display: flex;
            align-items: center;
          }

          h1 {
            margin: 0 20px 0 0;
            border-right: 1px solid rgba(0, 0, 0,.3);
            padding: 10px 20px 10px 0;
          }
        }
      `}</style>
    </Page>
  )
}

export default ErrorPage
