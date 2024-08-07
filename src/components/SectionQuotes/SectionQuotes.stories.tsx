import type { StoryObj } from '@storybook/react'

import appTheme from '@/theme'
import dataQuotes from '@/data/sample-quotes.json'

import SectionQuotes from './SectionQuotes'

const meta = {
  title: 'Layout-Components/SectionQuotes',
  component: SectionQuotes,
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
  },
  args: {
    title: (
      <h2>
        Déjà <strong style={{ color: appTheme.colors['primary'].main }}>12 667 communes</strong>{' '}
        ont mis à jour leurs bases d’adresses
      </h2>
    ),
    data: dataQuotes,
    theme: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    theme: undefined,
  },
}
