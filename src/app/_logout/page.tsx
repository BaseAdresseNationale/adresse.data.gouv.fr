import SectionHero from '@/components/SectionHero'
// import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'
// import { Button } from '@codegouvfr/react-dsfr/Button'
import LogoutProConnectButtonCustom from '@/components/LogoutProConnectButtonCustom/LogoutProConnectButtonCustom'

export default async function LogoutPage() {
  return (
    <SectionHero
      pageTitle="Se déconnecter de ProConnect sur La Base Adresse Nationale"
      picture={{
        src: '/img/home_page_hero_ban.svg',
        alt: 'Illustration de "La Base Adresse Nationale"',
        width: 400,
        height: 310,
      }}
    >
      <LogoutProConnectButtonCustom text="Se déconnecter de ProConnect" loginUrl="/api/logout" />
    </SectionHero>
  )
}
