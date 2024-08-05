'use client'

import Notices from '@/components/Notices'
import SectionHero from '@/components/SectionHero'
import SectionTilesList from '@/components/SectionTilesList'

import dataNotices from '@/data/sample-notices.json'
import dataBAN from '@/data/sample-ban-info.json'
import dataBAL from '@/data/sample-bal-info.json'
import dataActions from '@/data/sample-actions.json'

export default function Home() {
  return (
    <>
      <Notices {...dataNotices} />

      <SectionHero
        pageTitle="La base adresse nationale"
        picture={{
          src: './img/home_page_hero_ban.svg',
          alt: 'Illustration de "La base adresse nationale"',
          width: 400,
          height: 310,
        }}
        footerLinks={[
          {
            label: 'Découvrir la Base Adresse Nationale',
            href: '/decouvrir_la_BAN',
          },
        ]}
      >
        <p>
          Pour que les services d’urgence arrivent au bon endroit, pour vous
          permettre de réaliser une analyse cartographique ou encore pour mieux
          coordonnées les chantiers, les adresses sont un véritable enjeu de
          souveraineté pour la France.
        </p>
        <p>
          <strong>
            Notre Objectif : référencer l’intégralité des adresses du territoire et
            les rendre utilisables par tous.
          </strong>
        </p>
      </SectionHero>

      <SectionTilesList
        data={dataBAN}
        title="Utilisez la base adresse nationale"
        theme="secondary"
      />

      <SectionTilesList
        data={dataBAL}
        title="Constituez la base adresse locale de votre commune !"
      />

      <SectionTilesList
        data={dataActions}
        title="Constituez la base adresse locale de votre commune !"
        isSmallTiles
        withoutLinkIcon
      />
    </>
  )
}
