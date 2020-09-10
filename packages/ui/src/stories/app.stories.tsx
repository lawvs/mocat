import { Button } from '@storybook/react/demo'
import React from 'react'
import { action } from '@storybook/addon-actions'
import { create } from '..'

export default {
  title: 'App',
}

export const Basic = () => {
  const app = create()
  const unmount = app.unmount

  const mount = () => {
    action('mount')()
    app.mount()
  }

  const dispatch = () => {
    const eventName = 'Run/network/before' as const
    const e = {
      type: 'Run/network/before',
      requestType: 'fetch',
      rule: {
        type: 'Register/networkRoute',
        url: '/',
        method: '*',
        scenes: [
          {
            name: 'name',
            desc: 'desc',
            status: 200,
            response: { data: 'success' },
          },
        ],
      },
      request: new Request(''),
      resolve: action('resolve'),
      reject: action('reject'),
      pass: action('pass'),
    } as any

    action('dispatch')(eventName, e)
    app.hook.emit(eventName, e)
  }

  return (
    <>
      <Button onClick={mount}>Create</Button>
      <Button onClick={() => unmount()}>Unmount</Button>
      <Button onClick={() => dispatch()}>Dispatch</Button>
    </>
  )
}
