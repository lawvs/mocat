import { eventEmitter } from '../eventEmitter'

describe('emitter', () => {
  test('emitter should works', async () => {
    const event = 'event name'
    const listener = jest.fn()
    eventEmitter.on(event, listener)
    eventEmitter.emit(event)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith()
  })

  test('emit payload', async () => {
    const event = 'event name'
    const payload = { a: 1 }
    const listener = jest.fn()
    eventEmitter.on(event, listener)
    eventEmitter.emit(event, payload)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith(payload)
  })
})
