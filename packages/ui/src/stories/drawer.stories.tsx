import { action } from '@storybook/addon-actions'
import type { StoryFn } from '@storybook/react'
import { Drawer } from '../components/drawer'

export default {
  title: 'Drawer',
  component: Drawer,
  args: {
    onOpen: action('onOpen'),
    onClose: action('onClose'),
    children: 'content',
  },
  argTypes: {
    children: { control: { type: 'text' } },
  },
}

export const Basic: StoryFn<Parameters<typeof Drawer>[0]> = (args) => (
  <Drawer {...args} />
)
