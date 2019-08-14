// @see https://redux.js.org
import { createStore, compose } from 'redux'

import rootReducer from './reducer'

const DEBUG = process.env.NODE_ENV === 'development'

const configureStore = (preloadedState: any | {} = {}) => {
  // compose enhancers
  // @see https://github.com/zalmoxisus/redux-devtools-extension
  const composeEnhancers =
    DEBUG && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)
      : compose
  const enhancer = composeEnhancers()
  const store = createStore(rootReducer, preloadedState, enhancer)
  return store
}

export default configureStore
