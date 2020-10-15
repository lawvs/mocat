import { Button } from '@storybook/react/demo'
import React from 'react'
import { action } from '@storybook/addon-actions'
import { create } from '..'

export default {
  title: 'App',
}

export const Instance = () => {
  let app
  const unmount = () => app.unmount()

  const mount = () => {
    action('create')()
    app = create()
  }

  const dispatch = () => {
    if (!app) {
      console.warn('please create app first')
      return
    }
    const eventName = 'Run/network/before' as const
    const e = {
      type: 'Run/network/before',
      timeStamp: new Date().getTime(),
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
      <Button onClick={unmount}>Unmount</Button>
      <Button onClick={() => dispatch()}>Dispatch</Button>
    </>
  )
}
