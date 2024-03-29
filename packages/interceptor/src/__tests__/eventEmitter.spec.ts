import { eventEmitter, mockRoute } from '../eventEmitter'

describe('emitter', () => {
  test('emitter should works', async () => {
    const event = 'event name'
    const listener = jest.fn()
    // @ts-ignore
    eventEmitter.on(event, listener)
    // @ts-ignore
    eventEmitter.emit(event)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith()
  })

  test('emit payload', async () => {
    const event = 'event name'
    const payload = { a: 1 }
    const listener = jest.fn()
    // @ts-ignore
    eventEmitter.on(event, listener)
    // @ts-ignore
    eventEmitter.emit(event, payload)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith(payload)
  })
})

describe('mockRoute', () => {
  test('should register correct', () => {
    const listener = jest.fn()
    eventEmitter.once('Register/networkRoute', listener)
    mockRoute({ url: '/' })
    expect(listener).toBeCalledTimes(1)
  })
})
