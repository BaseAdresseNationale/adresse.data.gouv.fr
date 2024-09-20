import type { StoryObj } from '@storybook/react'

import SectionSearchBAN from './SectionSearchBAN'

const meta = {
  title: 'Layout-Components/SectionSearchBAN',
  component: SectionSearchBAN,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
  },
}
