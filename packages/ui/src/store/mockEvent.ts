import { useCallback, useEffect } from 'react'
import { usePrevious } from 'react-use'
import type { MockEvent } from '@mocat/interceptor'
import { useDispatch, useStore } from './store'
import { useAutoResponder } from './autoResponder'
import { useDrawer } from './drawer'

const useEventState = <T extends MockEvent['type']>(eventName: T) => {
  const { mockEvent: state } = useStore()
  const dispatch = useDispatch()
  const setState = useCallback(
    (payload: MockEvent[]) => dispatch({ type: 'MOCK_EVENT/UPDATE', payload }),
    [dispatch]
  )
  const { eventEmitter } = useStore()
  useEffect(() => {
    const handler = (e: MockEvent) => setState([...state, e])
    eventEmitter.on(eventName, handler)
    return () => {
      eventEmitter.off(eventName, handler)
    }
  }, [state, setState, eventEmitter, eventName])

  return [state, setState] as const
}

export const useMockState = () => {
  const [state, setState] = useEventState('Run/network/before')
  const { enable: autoResponseEnable, eventHandler } = useAutoResponder()
  const { setOpen, pin } = useDrawer()
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
    if (stateShow.length > prevLength && !pin) {
      setOpen(true)
    }
  }, [pin, prevLength, setOpen, stateShow.length])
  return [stateShow, setState] as const
}

export const useMockEventLength = () => useMockState()[0].length
