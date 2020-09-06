import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { hook } from './hook'
import { App } from './app'
import { createStoreProvider, rootReducer, initialState } from './store'
import type { State } from './store'
import { NOOP } from './utils'
// import './service'

export const create = ({ options }: { options?: Partial<State> } = {}) => {
  const app = {
    hook,
    mount: ({ el }: { el?: string | Element } = {}) => {
      if (typeof el === 'string') {
        el = document.querySelector(el) ?? undefined
      }
      if (!el) {
        el = document.createElement('div')
        document.body.append(el)
      }

      const unmount = () => unmountComponentAtNode(el as Element)
      app.unmount = unmount

      const StoreProvider = createStoreProvider(rootReducer, {
        ...initialState,
        ...options,
        unmount,
      })

      render(
        <StoreProvider>
          <App />
        </StoreProvider>,
        el
      )
      return unmount
    },
    unmount: NOOP,
  }
  return app
}
