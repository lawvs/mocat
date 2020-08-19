import React from 'react'
import { action } from '@storybook/addon-actions'
import { Drawer } from '../components/drawer'

export default {
  title: 'Drawer',
  component: Drawer,
}

export const DrawerComponent = () => (
  <Drawer onOpen={action('onOpen')} onClose={action('onClose')}>
    content
  </Drawer>
)
