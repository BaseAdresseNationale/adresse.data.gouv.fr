import Loader from '@/components/Loader'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../../../components/MiseEnForme'),
  { ssr: false, loading: () => <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '400px', alignItems: 'center' }}><Loader size={50} /></div> }
)

// This page is a dynamic import of the ValidateurBAL component
// because pre-rendering fails when importing package @ban-team/validateur-bal
export default function MiseEnFormePage() {
  return <DynamicComponentWithNoSSR />
}
