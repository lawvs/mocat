import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/react/types-6-0'
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

export const Basic: Story<Parameters<typeof Drawer>[0]> = (args) => (
  <Drawer {...args} />
)
