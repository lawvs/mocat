import React, { createContext, useReducer, useContext, Reducer } from 'react'
import { NOOP } from './utils'

export const initialState = {
  unmount: NOOP,
  theme: 'auto' as 'light' | 'dark' | 'auto',
}

export type State = typeof initialState
export type Action =
  | { type: 'UPDATE'; payload: Partial<State> }
  | { type: 'UNMOUNT' }

export const rootReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'UNMOUNT':
      setTimeout(() => state.unmount(), 0)
      return { ...state, unmount: NOOP }
    case 'UPDATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const StateContext = createContext<State>(initialState)
const DispatchContext = createContext<React.Dispatch<Action>>(NOOP)

export const createStoreProvider = (
  reducer: Reducer<State, Action>,
  initialState: State = (reducer as any)(undefined, { type: undefined })
) => {
  const StoreProvider = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    )
  }
  return StoreProvider
}

export const useStore = () => {
  const state = useContext(StateContext)
  return state
}

export const useDispatch = () => {
  const dispatch = useContext(DispatchContext)
  return dispatch
}
