import type { MockEvent } from '@mocat/interceptor'
import { useCallback } from 'react'
import { type State, useDispatch, useStore } from './store'

export type AutoResponderState = State['autoResponder']

const useUpdateAutoResponder = () => {
  const dispatch = useDispatch()
  return (payload: Partial<AutoResponderState>) =>
    dispatch({
      type: 'AUTO_RESPONDER/UPDATE',
      payload,
    })
}

export const useAutoResponder = () => {
  const {
    autoResponder: { enable, mode, delay },
  } = useStore()
  const updateAutoResponder = useUpdateAutoResponder()

  const eventHandler = useCallback(
    (e: MockEvent) => {
      if (e.type !== 'Run/network/before') {
        throw new Error('Event type incorrect: ' + JSON.stringify(e))
      }
      const withDelay = (fn: (...args: any) => void) => setTimeout(fn, delay)
      switch (mode) {
        case 'Scenario':
          if (e.rule.scenarios?.length) {
            const scenario = e.rule.scenarios[0]
            withDelay(() => e.resolve(scenario))
            break
          }
        // no scenarios
        // falls through
        case 'Pass':
          // TODO request first and wait for a delay
          withDelay(() => e.pass())
          break
        case 'Reject':
          withDelay(() => e.reject())
          break
        default:
          throw new Error('Unknown response mode! mode: ' + mode)
      }
    },
    [delay, mode],
  )

  const delayScenario = [100, 1000, 5000]
  const toggleDelay = (newDelay?: number) => {
    if (newDelay !== undefined) {
      updateAutoResponder({
        delay: newDelay,
      })
      return
    }
    updateAutoResponder({
      delay: delayScenario.find((i) => i > delay) ?? 0,
    })
  }
  return {
    enable,
    mode,
    delay,
    toggleDelay,
    eventHandler,
    toggleEnable: () =>
      updateAutoResponder({
        enable: !enable,
      }),
    switchMode: (newMode: AutoResponderState['mode']) =>
      updateAutoResponder({
        mode: newMode,
      }),
  }
}
