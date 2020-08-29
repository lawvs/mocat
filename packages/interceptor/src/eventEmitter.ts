// See https://github.com/EventEmitter2/EventEmitter2
import { EventEmitter2 } from 'eventemitter2'
import type { EventAndListener } from 'eventemitter2'
import type { MockRegister, RunEvent } from './types'

export const eventEmitter = new EventEmitter2()

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

export const registerMock = (rule: MockRegister) => {
  // mockMap.set(target, { desc, scenes })
  eventEmitter.emit(rule.type, rule)
}

// Run event

export const onRun = (event: RunEvent) => {
  eventEmitter.emit(event.type, event)
}
