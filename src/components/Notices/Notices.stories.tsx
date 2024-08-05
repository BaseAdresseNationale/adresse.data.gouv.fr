import type { StoryObj } from '@storybook/react'

import dataNotices from '@/data/sample-notices.json'

import Notices from './Notices'

const meta = {
  title: 'Layout-Components/Notices',
  component: Notices,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Données à afficher',
    },
    duration: {
      control: 'number',
      description: 'Durée d’affichage en millisecondes',
    },
    args: {
      data: dataNotices.data,
      duration: 3000,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: dataNotices.data,
    duration: 3000,
  },
}
