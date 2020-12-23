import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/react/types-6-0'
import { ActionCard } from '../components/actionCard'

export default {
  title: 'ActionCard',
  component: ActionCard,
  argTypes: {},
}

export const Basic: Story<Parameters<typeof ActionCard>[0]> = (args) => (
  <ActionCard {...args}></ActionCard>
)

Basic.args = {
  event: {
    type: 'Run/network/before',
    requestType: 'fetch',
    timeStamp: 1,
    rule: {
      name: 'name',
      desc: 'desc',
      type: 'Register/networkRoute',
      url: '/',
      timeStamp: 1,
      scenarios: [
        {
          name: 'scenario 1',
          desc: 'desc1',
          status: 200,
          response: { data: 'success' },
        },
        {
          name: 'scenario 2',
          desc: 'desc2',
          status: 400,
          response: { data: 'error' },
        },
        {
          name: 'scenario 3 without desc',
          response: { data: 'success' },
        },
      ],
    },

    request: new Request(''),
    resolve: action('resolve'),
    reject: action('reject'),
    pass: action('pass'),
  },
}

export const PostCard: Story<Parameters<typeof ActionCard>[0]> = (args) => (
  <ActionCard {...args}></ActionCard>
)

PostCard.args = {
  event: {
    type: 'Run/network/before',
    requestType: 'xhr',
    timeStamp: 1,
    rule: {
      name: 'name',
      desc: 'desc',
      type: 'Register/networkRoute',
      url: '/',
      timeStamp: 1,
      scenarios: [
        {
          name: 'scenario 1',
          response: { data: 'success' },
        },
      ],
    },

    request: new Request('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer xxxxx',
      },
      body: JSON.stringify({ a: 1 }),
    }),
    resolve: action('resolve'),
    reject: action('reject'),
    pass: action('pass'),
  },
}
