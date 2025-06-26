import SectionHero from '@/components/SectionHero'
import { ProConnectButton } from '@codegouvfr/react-dsfr/ProConnectButton'

export default async function LoginPage() {
  return (
    <SectionHero
      pageTitle="S'identifier avec ProConnect sur La Base Adresse Nationale"
      picture={{
        src: '/img/home_page_hero_ban.svg',
        alt: 'Illustration de "La Base Adresse Nationale"',
        width: 400,
        height: 310,
      }}
    >
      <ProConnectButton url="/api/login" />
    </SectionHero>
  )
}
