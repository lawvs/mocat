import { useState, useEffect } from 'react'
import { eventEmitter } from '@rabbit-mock/interceptor'
import type { MockEventMap } from '@rabbit-mock/interceptor'

export const hook = eventEmitter

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
