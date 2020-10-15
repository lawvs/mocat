import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { App } from './app'
import { createStoreProvider, rootReducer, initialState } from './store'
import type { State } from './store'
// import './service'

export interface UIOptions extends Partial<State> {
  el?: string | Element
}

export const create = ({ el, ...options }: UIOptions = {}) => {
  if (typeof el === 'string') {
    el = document.querySelector(el) ?? undefined
  }
  if (!el) {
    el = document.createElement('div')
    el.id = 'rabbit-hole'
    document.body.append(el)
  }

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

  const app = {
    hook: options?.eventEmitter || initialState.eventEmitter,
    unmount: () => {
      unmountComponentAtNode(el as any)
    },
  }
  return app
}
