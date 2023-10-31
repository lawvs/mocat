import { action } from '@storybook/addon-actions'
import { createStoreProvider, rootReducer, initialState } from '../store'
import { App } from '../app'
import { create } from '..'

export default {
  title: 'App',
}

export const DefaultPin = () => {
  const StoreProvider = createStoreProvider(rootReducer, {
    ...initialState,
    ...{ drawer: { pin: true, open: true } },
  })

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
      <button onClick={dispatch}>Dispatch</button>
      <StoreProvider>
        <App />
      </StoreProvider>
    </>
  )
}

export const Instance = () => {
  let app: ReturnType<typeof create>
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
      <button onClick={mount}>Create</button>
      <button onClick={unmount}>Unmount</button>
      <button onClick={dispatch}>Dispatch</button>
    </>
  )
}
