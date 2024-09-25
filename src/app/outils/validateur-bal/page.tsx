import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../../../components/ValidateurBAL'),
  { ssr: false }
)

// This page is a dynamic import of the ValidateurBAL component
// because pre-rendering fails when importing package @ban-team/validateur-bal
export default function ValidateurBALPage() {
  return <DynamicComponentWithNoSSR />
}
