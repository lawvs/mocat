import { createRoot } from 'react-dom/client'
import { App } from './app'
import { createStoreProvider, rootReducer, initialState } from './store'
import type { State } from './store'
import { i18nInstance } from './i18n'
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
    el.id = 'mocat-root'
    document.body.append(el)
  }

  const language = options.language
  if (language && language !== 'auto') {
    i18nInstance.changeLanguage(language)
  }

  const StoreProvider = createStoreProvider(rootReducer, {
    ...initialState,
    ...options,
  })

  const root = createRoot(el)

  root.render(
    <StoreProvider>
      <App />
    </StoreProvider>
  )

  const app = {
    hook: options?.eventEmitter || initialState.eventEmitter,
    unmount: () => {
      root.unmount()
    },
  }
  return app
}
