import { Button } from '@storybook/react/demo'
import { action } from '@storybook/addon-actions'
import merge from 'lodash/merge'
import { createStoreProvider, rootReducer, initialState } from '../store'
import { App } from '../app'
import { create } from '..'

export default {
  title: 'App',
}

export const DefaultPin = () => {
  const StoreProvider = createStoreProvider(
    rootReducer,
    merge(initialState, { drawer: { pin: true, open: true } })
  )

  const dispatch = () => {
    const eventName = 'Run/network/before' as const
    const e = {
      type: 'Run/network/before',
      timeStamp: new Date().getTime(),
      requestType: 'fetch',
      rule: {
        type: 'Register/networkRoute',
        url: '/',
        method: '*',
        scenarios: [
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
    initialState.eventEmitter.emit(eventName, e)
  }

  return (
    <>
      <Button onClick={dispatch}>Dispatch</Button>
      <StoreProvider>
        <App />
      </StoreProvider>
    </>
  )
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
      action('warn')('please create app first')
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
        scenarios: [
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
      <Button onClick={dispatch}>Dispatch</Button>
    </>
  )
}
