import { useTheme } from '@material-ui/core'
import React, {
  createContext,
  useReducer,
  useContext,
  Reducer,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { eventEmitter } from '@rabbit-mock/interceptor'
import type { MockEventMap, MockEvent } from '@rabbit-mock/interceptor'
import { NOOP } from '../utils'

export const initialState = {
  theme: 'auto' as 'auto' | 'light' | 'dark',
  drawerMode: 'auto' as 'auto' | 'pin' | 'silent',
  eventEmitter,
  disablePass: false,
  autoResponder: {
    enable: false,
    mode: 'scene' as 'scene' | 'pass' | 'reject',
    delay: 0, // TODO delay with auto responder
  },
}

export type State = typeof initialState
export type Action = { type: 'UPDATE'; payload: Partial<State> }

export const rootReducer = (state: State, action: Action) => {
  switch (action.type) {
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

const useDispatch = () => {
  const dispatch = useContext(DispatchContext)
  return dispatch
}

export const useThemeConfig = () => {
  const { theme } = useStore()
  return theme
}

export const useThemeSwitch = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const currentTheme = theme.palette.type
  return {
    currentTheme,
    toggle: () =>
      dispatch({
        type: 'UPDATE',
        payload: { theme: currentTheme === 'light' ? 'dark' : 'light' },
      }),
    // setLight, setDark
  }
}

const useEventState = <T extends keyof MockEventMap>(eventName: T) => {
  const [state, setState] = useState<MockEventMap[T][]>([])
  const { eventEmitter } = useStore()
  useEffect(() => {
    const handler = (e: MockEventMap[T]) => setState([...state, e])
    eventEmitter.on(eventName, handler)
    return () => {
      eventEmitter.off(eventName, handler)
    }
  }, [state, setState, eventEmitter, eventName])

  return [state, setState] as const
}

export const useDrawer = () => {
  const { drawerMode: mode } = useStore()
  const [event] = useMockState()
  const [open, setOpen] = useState(mode === 'pin' || false)
  const [pin, setPin] = useState(mode === 'pin' || false)

  const firstUpdate = useRef(true)
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (mode === 'auto') {
      Promise.resolve().then(() => setOpen(true))
    }
  }, [event, mode])

  const toggleDrawer = () => !pin && setOpen(!open)
  const togglePin = () => setPin(!pin)
  const whenClickAway = () => !pin && setOpen(false)

  return {
    mode,
    open,
    pin,
    // setOpen,
    // setPin,
    toggleDrawer,
    togglePin,
    whenClickAway,
  }
}

export const useAutoResponder = () => {
  const {
    autoResponder: { enable, mode, delay },
  } = useStore()
  const dispatch = useDispatch()

  const eventHandler = useCallback(
    (e: MockEvent) => {
      if (e.type !== 'Run/network/before') {
        throw new Error('Event type incorrect')
      }
      switch (mode) {
        case 'scene':
          if (e.rule.scenes?.length) {
            e.resolve(e.rule.scenes[0])
            break
          }
          e.pass()
          break
        case 'pass':
          e.pass()
          break
        case 'reject':
          e.reject()
          break
        default:
          throw new Error('Unknown response mode! mode: ' + mode)
      }
    },
    [mode]
  )

  return {
    enable,
    mode,
    delay,
    eventHandler,
    toggleEnable: () =>
      dispatch({
        type: 'UPDATE',
        payload: { autoResponder: { enable: !enable, mode, delay } },
      }),
    switchMode: (newMode: State['autoResponder']['mode']) =>
      dispatch({
        type: 'UPDATE',
        payload: { autoResponder: { enable, mode: newMode, delay } },
      }),
  }
}

export const useMockState = () => {
  const [state, setState] = useEventState('Run/network/before')
  const { enable: autoResponseEnable, eventHandler } = useAutoResponder()

  useEffect(() => {
    if (autoResponseEnable && state.length) {
      state.forEach((e) => eventHandler(e))
      setState([])
    }
  }, [state, setState, autoResponseEnable, eventHandler])
  return [state, setState] as const
}
