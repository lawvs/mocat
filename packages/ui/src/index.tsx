import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { hook } from './hook'
import { App } from './app'
// import './service'

export const create = () => {
  return {
    hook,
    mount: ({ el }: { el?: string | Element } = {}) => {
      if (typeof el === 'string') {
        el = document.querySelector(el) ?? undefined
      }
      if (!el) {
        el = document.createElement('div')
        document.body.append(el)
      }

      render(<App />, el)
      return () => unmountComponentAtNode(el as Element)
    },
  }
}
