import { emit, on } from '../eventEmitter'

describe('emitter', () => {
  test('emitter should works', async () => {
    const event = 'event name'
    const listener = jest.fn()
    on(event, listener)
    emit(event)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith()
  })

  test('emit payload', async () => {
    const event = 'event name'
    const payload = { a: 1 }
    const listener = jest.fn()
    on(event, listener)
    emit(event, payload)
    expect(listener).toBeCalledTimes(1)
    expect(listener).toBeCalledWith(payload)
  })
})
