import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { App } from './app'
import { createStoreProvider, rootReducer, initialState } from './store'
import type { State } from './store'
// import './service'

export const create = ({ options }: { options?: Partial<State> } = {}) => {
  let isMounted = false
  const app = {
    mount: ({ el }: { el?: string | Element } = {}) => {
      if (isMounted) {
        console.warn('App has already been mounted.')
        return
      }
      if (typeof el === 'string') {
        el = document.querySelector(el) ?? undefined
      }
      if (!el) {
        el = document.createElement('div')
        el.id = 'rabbit-hole'
        document.body.append(el)
      }

      isMounted = true
      ;(app as any)._container = el

      const StoreProvider = createStoreProvider(rootReducer, {
        ...initialState,
        ...options,
      })

      render(
        <StoreProvider>
          <App />
        </StoreProvider>,
        el
      )
    },
    unmount: () => {
      if (!isMounted) {
        console.warn(`Cannot unmount an app that is not mounted.`)
        return
      }
      unmountComponentAtNode((app as any)._container)
      isMounted = false
    },
  }
  return app
}
