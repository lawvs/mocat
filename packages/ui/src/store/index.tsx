import { useTheme } from '@material-ui/core'
import React, {
  createContext,
  useReducer,
  useContext,
  Reducer,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { EventEmitter2 } from 'eventemitter2'
import usePrevious from 'react-use/lib/usePrevious'
import type {
  MockEventEmitter,
  MockEventMap,
  MockEvent,
} from '@rabbit-mock/interceptor'
import { NOOP } from '../utils'

export const initialState = {
  theme: 'auto' as 'auto' | 'light' | 'dark',
  drawer: {
    /** fixed drawer */
    pin: false,
    open: false,
  },
  eventEmitter: new EventEmitter2() as MockEventEmitter,
  disablePass: false,
  autoResponder: {
    enable: false,
    mode: 'scene' as 'scene' | 'pass' | 'reject',
    delay: 0, // TODO delay with auto responder
  },
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
  const currentTheme = theme.palette.mode
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

export const useDrawer = () => {
  const {
    drawer: { pin, open },
  } = useStore()
  const dispatch = useDispatch()
  const setOpen = useCallback(
    (newState = true) => {
      if (pin) {
        return
      }
      // TODO other solution
      // wait click away
      setTimeout(
        () =>
          dispatch({
            type: 'DRAWER/UPDATE',
            payload: { open: newState },
          }),
        0
      )
    },
    [dispatch, pin]
  )

  const setPin = useCallback(
    (newState: boolean) =>
      dispatch({
        type: 'DRAWER/UPDATE',
        payload: { pin: newState },
      }),
    [dispatch]
  )

  const togglePin = () => setPin(!pin)
  const whenClickAway = useCallback(() => {
    if (pin) {
      return
    }
    dispatch({
      type: 'DRAWER/UPDATE',
      payload: { open: false },
    })
  }, [dispatch, pin])

  return {
    open: pin || open,
    pin,
    setOpen,
    // setPin,
    // toggleDrawer: () => setOpen(!open),
    togglePin,
    whenClickAway,
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
      const withDelay = (fn: (...args: any) => void) => setTimeout(fn, delay)
      switch (mode) {
        case 'scene':
          if (e.rule.scenes?.length) {
            const scene = e.rule.scenes[0]
            withDelay(() => e.resolve(scene))
            break
          }
          withDelay(() => e.pass())
          break
        case 'pass':
          withDelay(() => e.pass())
          break
        case 'reject':
          withDelay(() => e.reject())
          break
        default:
          throw new Error('Unknown response mode! mode: ' + mode)
      }
    },
    [delay, mode]
  )

  const delayScene = [100, 1000, 5000]
  const toggleDelay = () =>
    dispatch({
      type: 'AUTO_RESPONDER/UPDATE',
      payload: { delay: delayScene.find((i) => i > delay) ?? 0 },
    })

  return {
    enable,
    mode,
    delay,
    toggleDelay,
    eventHandler,
    toggleEnable: () =>
      dispatch({
        type: 'AUTO_RESPONDER/UPDATE',
        payload: { enable: !enable },
      }),
    switchMode: (newMode: State['autoResponder']['mode']) =>
      dispatch({
        type: 'AUTO_RESPONDER/UPDATE',
        payload: { mode: newMode },
      }),
  }
}

export const useMockState = () => {
  const [state, setState] = useEventState('Run/network/before')
  const { enable: autoResponseEnable, eventHandler } = useAutoResponder()
  const { setOpen } = useDrawer()
  const stateShow = autoResponseEnable ? [] : state
  const prevLength = usePrevious(state.length) ?? 0
  useEffect(() => {
    if (autoResponseEnable && state.length) {
      state.forEach(eventHandler)
      setState([])
    }
  }, [autoResponseEnable, eventHandler, setState, state])

  useEffect(() => {
    // open drawer automatic when event changes
    if (stateShow.length > prevLength) {
      setOpen(true)
    }
  }, [prevLength, setOpen, stateShow.length])
  return [stateShow, setState] as const
}
