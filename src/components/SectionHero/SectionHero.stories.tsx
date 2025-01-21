import type { StoryObj } from '@storybook/react'
import SectionHero from './SectionHero'

const meta = {
  title: 'Layout-Components/SectionHero',
  component: SectionHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    pageTitle: {
      control: 'text',
      description: 'Titre de la page',
    },
    children: {
      control: 'text',
      description: 'Contenu de la page',
    },
    footerLinks: {
      control: 'object',
      description: 'Liens à afficher dans le footer',
    },
    picture: {
      control: 'object',
      description: 'Image d‘illustration',
    },
    args: {
      pageTitle: 'Page title',
      children: [
        <p key="a">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sodales
          nulla vel vulputate congue. Maecenas laoreet egestas fringilla.
          Quisque feugiat nibh at urna viverra, quis malesuada leo
          congue.
        </p>,
        <p key="b">
          <strong>
            Maecenas vitae porta elit. Maecenas finibus accumsan libero id auctor.
            Quisque at luctus metus. Sed maximus sagittis vehicula. Cras vehicula
            ultrices tortor et pharetra. Integer mi nibh, gravida dapibus mattis
            at, aliquam in dui.
          </strong>
        </p>,
      ],
      footerLinks: [{
        label: 'Link label',
        href: 'https://example.com',
        target: '_blank',
      }],
      picture: {
        src: '/img/home_page_hero_ban.svg',
        alt: 'Illustration de "La base adresse nationale"',
        width: 400,
        height: 310,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    pageTitle: 'Page title',
    children: [
      <p key="a">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sodales
        nulla vel vulputate congue. Maecenas laoreet egestas fringilla.
        Quisque feugiat nibh at urna viverra, quis malesuada leo
        congue.
      </p>,
      <p key="b">
        <strong>
          Maecenas vitae porta elit. Maecenas finibus accumsan libero id auctor.
          Quisque at luctus metus. Sed maximus sagittis vehicula. Cras vehicula
          ultrices tortor et pharetra. Integer mi nibh, gravida dapibus mattis
          at, aliquam in dui.
        </strong>
      </p>,
    ],
    footerLinks: [{
      label: 'Link label',
      href: 'https://example.com',
      target: '_blank',
    }],
    picture: {
      src: '/img/home_page_hero_ban.svg',
      alt: 'Illustration de "La base adresse nationale"',
      width: 400,
      height: 310,
    },
  },
}
