import React from 'react'
import { action } from '@storybook/addon-actions'
import type { Story } from '@storybook/react/types-6-0'
import { ActionCard } from '../components/action-card'

export default {
  title: 'ActionCard',
  component: ActionCard,
  args: {
    name: 'name',
    desc: 'desc',
    children: 'content',
    actions: [
      {
        name: 'pass',
        action: action('pass'),
      },
      {
        name: 'pass and intercept return',
        action: action('pass and intercept return'),
      },
      {
        name: 'mock',
        action: action('mock'),
      },
      {
        name: 'reject',
        action: action('reject'),
      },
    ],
  },
  argTypes: {
    children: { control: { type: 'text' } },
  },
}

export const Basic: Story<Parameters<typeof ActionCard>[0]> = (args) => (
  <ActionCard {...args}></ActionCard>
)
