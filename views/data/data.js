import Head from '@/components/head'
import Page from '@/layouts/main'
import {Download} from 'react-feather'
import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'
import Link from 'next/link'

function Data({path = []}) {
  const [loadedData, setLoadedData] = useState()

  useEffect(() => {
    const callData = async () => {
      const content = await fetch('/api/data?path=' + path.join('/'))
      const contentJson = await content.json()
      setLoadedData(contentJson)
    }

    callData()
  }, [path, setLoadedData])

  const title = ['data', ...path].join('/')

  return (
    <Page title={title}>
      <Head title={title} icon={<Download size={56} alt='' aria-hidden='true' />} />
      {path.length > 0 && <div>
        <Link href={path.slice(0, -1).join('/')} >&lt;&lt;&lt;</Link>
      </div>}
      <div>
        {loadedData ? <ul>{loadedData.data.map(entry => <li key={entry.name}><Link legacyBehavior href={entry.isDirectory ? './' + [...path, entry.name].join('/') : '/api/data?path=' + [...path, entry.name].join('/')}>{entry.name}</Link></li>)}</ul> : 'Chargement...'}
      </div>
    </Page>
  )
}

Data.propTypes = {
  path: PropTypes.array.isRequired
}

export default Data
