import type { GetServerSidePropsContext } from 'next'
import PropTypes from 'prop-types'
import Section from '@/components/Section'
import Breadcrumb from '@/layouts/Breadcrumb'
import NotFoundPage from '@/app/not-found'
import { pageConfig } from '@/views/data/config'
import Data from '@/views/data/components/Data'
import { handleS3Data } from '@/lib/data-service'

interface DataPageProps {
  title: string
  path: string[]
  data: object[]
  config: object
  errorCode: number
  errorMessage: string
}

const { rootLink } = pageConfig

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return handleS3Data(context as any)
}

export default function DataPage({ path, data, config, errorCode }: DataPageProps) {
  const currentDir = ['data', ...(path || [])].slice(-1)

  return errorCode && errorCode !== 200
    ? (
        <>
          {path && (
            <Breadcrumb
              currentPageLabel={currentDir}
              segments={[
                {
                  label: rootLink.label,
                  linkProps: { href: rootLink.href },
                },
                ...[...['data', ...path].slice(0, path.length)].map((dir, index) => ({
                  label: dir,
                  linkProps: { href: `/data/${path.slice(0, index).join('/')}` },
                })),
              ]}
            />
          )}
          <NotFoundPage />
        </>
      )
    : (path
        ? (
            <>
              <Breadcrumb
                currentPageLabel={currentDir}
                segments={[
                  {
                    label: rootLink.label,
                    linkProps: { href: rootLink.href },
                  },
                  ...[...['data', ...path].slice(0, path.length)].map((dir, index) => ({
                    label: dir,
                    linkProps: { href: `/data/${path.slice(0, index).join('/')}` },
                  })),
                ]}
              />

              <Section>
                <Data {...{ path, data, config }} />
                {/* <Data {...{ root: rootLink, path, data, config }} /> */}
              </Section>
            </>
          )
        : null)
}

DataPage.propTypes = {
  title: PropTypes.string,
  path: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  config: PropTypes.shape({
    hero: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  errorCode: PropTypes.number,
  errorMessage: PropTypes.string,
}
