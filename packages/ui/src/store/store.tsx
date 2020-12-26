import { createContext, useReducer, useContext, Reducer } from 'react'
import { EventEmitter2 } from 'eventemitter2'
import type { MockEventEmitter, MockEvent } from '@mocat/interceptor'
import { NOOP } from '../utils'
import type { Languages } from '../i18n'

export const initialState = {
  brandTitle: 'Mocat',
  language: 'auto' as 'auto' | Languages,
  theme: 'auto' as 'auto' | 'light' | 'dark',
  drawer: {
    /** drawer fixed state */
    pin: false,
    /** drawer open state */
    open: false,
  },
  disablePass: false,
  autoResponder: {
    enable: false,
    mode: 'Scenario' as 'Scenario' | 'Pass' | 'Reject',
    delay: 0,
  },
  eventEmitter: new EventEmitter2() as MockEventEmitter,
  /**
   * @internal
   */
  mockEvent: [] as MockEvent[],
}

export type State = typeof initialState
export type Action =
  | { type: 'UPDATE'; payload: Partial<State> }
  | {
      type: 'DRAWER/UPDATE'
      payload: Partial<State['drawer']>
    }
  | {
      type: 'AUTO_RESPONDER/UPDATE'
      payload: Partial<State['autoResponder']>
    }
  | { type: 'MOCK_EVENT/UPDATE'; payload: State['mockEvent'] }

export const rootReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.payload }
    case 'DRAWER/UPDATE':
      return { ...state, drawer: { ...state.drawer, ...action.payload } }
    case 'AUTO_RESPONDER/UPDATE':
      return {
        ...state,
        autoResponder: { ...state.autoResponder, ...action.payload },
      }
    case 'MOCK_EVENT/UPDATE':
      return {
        ...state,
        mockEvent: action.payload,
      }
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
