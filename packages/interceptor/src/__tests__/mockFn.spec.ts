import { mockAsync } from '../mockFn'
import { onAny } from '../eventEmitter'

describe('mockAsync should works as before mock', () => {
  onAny((_, payload) => payload.pass())

  test('mockAsync should works with resolve', async () => {
    const asyncFn = () => Promise.resolve(1)
    const mockFn = mockAsync()(asyncFn)
    expect(await mockFn()).toEqual(await asyncFn())
  })

  test('mockAsync should works with reject', async () => {
    const asyncFn = () => Promise.reject(1)
    const mockFn = mockAsync()(asyncFn)
    expect(await mockFn().catch((i) => i)).toEqual(
      await asyncFn().catch((i) => i)
    )
  })
})
