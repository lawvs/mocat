// See https://github.com/EventEmitter2/EventEmitter2
import { EventEmitter2 } from 'eventemitter2'
import type { EventAndListener } from 'eventemitter2'

export const eventEmitter = new EventEmitter2()

export const emit = (...args: Parameters<EventEmitter2['emit']>) =>
  eventEmitter.emit(...args)

export const on = (...args: Parameters<EventEmitter2['on']>) =>
  eventEmitter.on(...args)

export const onAny = (...args: Parameters<EventEmitter2['onAny']>) =>
  eventEmitter.onAny(...args)

export const debug = () => {
  const log: EventAndListener = (event, ...payload) =>
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
