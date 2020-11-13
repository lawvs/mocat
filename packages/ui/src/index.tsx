import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import merge from 'lodash/merge'
import { App } from './app'
import { createStoreProvider, rootReducer, initialState } from './store'
import type { State } from './store'
// import './service'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export interface UIOptions extends DeepPartial<State> {
  el?: string | Element
}

export const create = ({ el, ...options }: UIOptions = {}) => {
  if (typeof el === 'string') {
    el = document.querySelector(el) ?? undefined
  }
  if (!el) {
    el = document.createElement('div')
    el.id = 'mocat-root'
    document.body.append(el)
  }

  const StoreProvider = createStoreProvider(
    rootReducer,
    merge(initialState, options)
  )

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
