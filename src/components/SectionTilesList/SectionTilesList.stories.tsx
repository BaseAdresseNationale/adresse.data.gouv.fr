import type { StoryObj } from '@storybook/react'

import appTheme from '@/theme'

import dataBAL from '@/data/sample-bal-info.json'
import dataActions from '@/data/sample-actions.json'

import SectionTilesList from './SectionTilesList'

const meta = {
  title: 'Layout-Components/SectionTilesList',
  component: SectionTilesList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Titre de la section',
    },
    data: {
      control: 'object',
      description: 'Donnéees à afficher',
    },
    theme: {
      control: 'radio',
      options: [undefined, ...Object.keys(appTheme.colors)],
      description: 'Thème graphique de la section. Cette propriété déterminera notamment la couleur de fond',
    },
    tileTitleAs: {
      control: 'radio',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Balise HTML du titre des tuiles',
    },
    isSmallTiles: {
      control: 'boolean',
      description: 'Affiche les tuiles au format réduit',
    },
    withoutLinkIcon: {
      control: 'boolean',
      description: 'Masque l’icône de lien',
    },
  },
  args: {
    title: (
      <h2>
        Déjà <strong style={{ color: appTheme.colors['primary'].main }}>12 667 communes</strong>{' '}
        ont mis à jour leur base d’adresses
      </h2>
    ),
    data: dataActions,
    theme: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Utilisez la base adresse nationale',
    data: dataBAL,
    theme: undefined,
    tileTitleAs: 'h3',
    isSmallTiles: false,
    withoutLinkIcon: false,
  },
}

export const Small: Story = {
  args: {
    title: 'Utilisez la base adresse nationale',
    data: dataActions,
    theme: undefined,
    tileTitleAs: 'h3',
    isSmallTiles: true,
    withoutLinkIcon: true,
  },
}
