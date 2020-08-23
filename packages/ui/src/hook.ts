/* eslint-disable @typescript-eslint/ban-types */
import { useState, useEffect } from 'react'

export interface EventHook {
  emit: (event: string, ...payload: any[]) => void
  on: (event: string, handler: Function) => void
  // once: (event: string, handler: Function) => void
  off: (event: string, handler: Function) => void
}

const listeners: Record<string, Function[]> = {}

export const hook: EventHook = {
  emit: (event, data) => {
    if (listeners[event]) {
      listeners[event].map((fn) => fn(data))
    }
  },
  on: (event, fn) => {
    if (!listeners[event]) {
      listeners[event] = []
    }
    listeners[event].push(fn)
  },
  // once: () => { /*noop*/ },
  off: (event, fn) => {
    if (!listeners[event]) {
      return
    }
    const index = listeners[event].indexOf(fn)
    if (index !== -1) {
      listeners[event].splice(index, 1)
    }
    if (!listeners[event].length) {
      delete listeners[event]
    }
  },
}

export const useEventState = (eventName: string) => {
  const [state, setState] = useState<any[]>([])
  useEffect(() => {
    const handler = (e: any) => setState([...state, e])
    hook.on(eventName, handler)
    return () => hook.off(eventName, handler)
  }, [state])
  return [state, setState] as const
}

if (process.env.NODE_ENV === 'development') {
  ;(hook as any).listeners = listeners
  ;(globalThis as any).__RABBIT_UI_HOOK__ = hook
}
