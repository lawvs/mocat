import { Button } from '@storybook/react/demo'
import React from 'react'
import { action } from '@storybook/addon-actions'
import { create } from '..'

export default {
  title: 'App',
}

const app = create()

export const Basic = () => {
  let unmount = () => {
    action('mount first please')()
  }

  const mount = () => {
    action('mounted')()
    unmount = app.mount()
  }

  const dispatch = () => {
    const e = { name: Math.random() }
    action('dispatch')('event', e)
    app.hook.emit('event', e)
  }

  return (
    <>
      <Button onClick={mount}>Mount</Button>
      <Button onClick={() => unmount()}>Unmount</Button>
      <Button onClick={() => dispatch()}>Dispatch</Button>
    </>
  )
}
