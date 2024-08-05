'use client'

import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'

export default function Home() {
  return (
    <>
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

      <Section title="Section Title A">Some content A</Section>
      <Section title="Section Title B" theme="secondary">
        Some content B
      </Section>
      <Section title="Section Title C">Some content C</Section>
    </>
  )
}
