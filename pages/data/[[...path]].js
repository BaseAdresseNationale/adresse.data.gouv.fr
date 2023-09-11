import withErrors from '@/components/hoc/with-errors'
import Data from '@/views/data'
import {useRouter} from 'next/router'

function DataPage() {
  const router = useRouter()
  const {path = []} = router.query
  return <Data path={path} />
}

export default withErrors(DataPage)
