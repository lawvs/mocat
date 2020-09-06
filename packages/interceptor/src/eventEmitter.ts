// See https://github.com/EventEmitter2/EventEmitter2
import { EventEmitter2 } from 'eventemitter2'
import type { EventAndListener } from 'eventemitter2'
import type { MockEventMap, RegisterEvent, RunEvent } from './types'

export interface MockEventEmitter {
  emit<T extends keyof MockEventMap>(event: T, value: MockEventMap[T]): boolean

  on<T extends keyof MockEventMap>(
    event: T,
    listener: (value: MockEventMap[T]) => void
  ): void
  once<T extends keyof MockEventMap>(
    event: T,
    listener: (value: MockEventMap[T]) => void
  ): void
  onAny<T extends keyof MockEventMap>(
    listener: (event: T, value: MockEventMap[T]) => void
  ): void
  off<T extends keyof MockEventMap>(
    event: T,
    listener: (...values: any[]) => void
  ): this
  offAny(listener: (value: any[]) => void): this
}

// @ts-ignore
export const eventEmitter: MockEventEmitter = new EventEmitter2()

export const debug = () => {
  const log: EventAndListener = (event, ...payload) =>
    // eslint-disable-next-line no-console
    console.log(
      `%cReceive%c %c${event.toString()}`,
      'background: rgba(0, 255, 255, 0.6); color: black; padding: 0px 6px; border-radius: 4px;',
      '',
      'text-decoration: underline',
      payload
    )
  eventEmitter.onAny(log)
  return () => eventEmitter.offAny(log)
}

// Register event

// const mockMap = new Map<any, any>()

export const registerMock = (rule: RegisterEvent) => {
  // mockMap.set(target, { desc, scenes })
  eventEmitter.emit(rule.type, rule)
}

// Run event

export const onRun = (event: RunEvent) => {
  eventEmitter.emit(event.type, event)
}
