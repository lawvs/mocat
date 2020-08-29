import { mockAsyncFn } from '../mockFn'
import { eventEmitter } from '../eventEmitter'

describe('mockAsync should works', () => {
  eventEmitter.onAny((_, payload) => payload.pass?.())

  test('should register fn correct', async () => {
    const asyncFn = () => Promise.resolve(1)
    const listener = jest.fn()
    eventEmitter.on('Register/asyncFn', listener)
    mockAsyncFn()(asyncFn)
    expect(listener).toBeCalledTimes(1)
  })

  test('mockAsync should works with resolve', async () => {
    const asyncFn = () => Promise.resolve(1)
    const mockFn = mockAsyncFn()(asyncFn)
    expect(await mockFn()).toEqual(await asyncFn())
  })

  test('mockAsync should works with reject', async () => {
    const asyncFn = () => Promise.reject(1)
    const mockFn = mockAsyncFn()(asyncFn)
    expect(await mockFn().catch((i) => i)).toEqual(
      await asyncFn().catch((i) => i)
    )
  })
})
