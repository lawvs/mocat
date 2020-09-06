import { useState, useEffect } from 'react'
import { EventEmitter2 } from 'eventemitter2'
import type { MockEventMap, MockEventEmitter } from '@rabbit-mock/interceptor'

// @ts-ignore
export const hook: MockEventEmitter = new EventEmitter2()

const useEventState = <T extends keyof MockEventMap>(eventName: T) => {
  const [state, setState] = useState<MockEventMap[T][]>([])
  useEffect(() => {
    const handler = (e: MockEventMap[T]) => setState([...state, e])

    hook.on(eventName, handler)
    return () => {
      hook.off(eventName, handler)
    }
  }, [state])
  return [state, setState] as const
}

export const useMockState = () => useEventState('Run/network/before')
