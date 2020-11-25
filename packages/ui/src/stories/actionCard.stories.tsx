import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/react/types-6-0'
import { ActionCard } from '../components/actionCard'

export default {
  title: 'ActionCard',
  component: ActionCard,
  args: {
    event: {
      type: 'Run/network/before',
      requestType: 'fetch',
      rule: {
        name: 'name',
        desc: 'desc',
        type: 'Register/networkRoute',
        url: '/',
        method: '*',
        scenes: [
          {
            name: 'scene 1',
            desc: 'desc1',
            status: 200,
            response: { data: 'success' },
          },
          {
            name: 'scene 2',
            desc: 'desc2',
            status: 400,
            response: { data: 'error' },
          },
          {
            name: 'scene 3 without desc',
            response: { data: 'success' },
          },
        ],
      },

      request: new Request(''),
      resolve: action('resolve'),
      reject: action('reject'),
      pass: action('pass'),
    },
  },
  argTypes: {
    // children: { control: { type: 'text' } },
  },
}

export const Basic: Story<Parameters<typeof ActionCard>[0]> = (args) => (
  <ActionCard {...args}></ActionCard>
)
