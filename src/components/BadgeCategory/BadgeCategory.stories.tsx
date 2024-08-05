import type { StoryObj } from '@storybook/react'
import BadgeCategory from './BadgeCategory'

const meta = {
  title: 'Atom-Components/BadgeCategory',
  component: BadgeCategory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Contenu du badge',
    },
    theme: {
      control: 'radio',
      options: [null, 'primary', 'secondary'],
      description: 'Thème graphique du composant. Cette propriété déterminera notamment les couleurs de fond et de texte',
    },
  },
  args: {
    children: 'Hello world',
    theme: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Category name',
    theme: undefined,
  },
}
