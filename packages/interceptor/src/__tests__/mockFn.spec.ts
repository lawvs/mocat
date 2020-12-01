import { mockAsyncFn } from '../mockFn'
import { eventEmitter } from '../eventEmitter'

describe('mockAsync should works', () => {
  beforeAll(() => {
    eventEmitter.on('Run/asyncFn/before', (payload) => payload.pass())
  })

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

describe('mock test', () => {
  test('mockAsync should works with resolve', async () => {
    eventEmitter.on('Run/asyncFn/before', (payload) => payload.resolve(2))
    const asyncFn = () => Promise.resolve(1)
    const mockFn = mockAsyncFn()(asyncFn)
    expect(await mockFn()).toEqual(2)
  })
})

describe('snapshot test', () => {
  beforeAll(() => {
    eventEmitter.onAny((_, payload) => 'pass' in payload && payload.pass())
  })

  test('event match snapshot', async () => {
    const listener = jest.fn((...args) => expect(args).toMatchSnapshot())
    eventEmitter.on('Register/asyncFn', listener)
    eventEmitter.on('Run/asyncFn/before', listener)

    const asyncFn = () => Promise.resolve(1)
    const mockFn = mockAsyncFn({
      name: 'login api',
      desc: 'it is a mock api',
      scenarios: [
        {
          name: 'scenario 1',
          desc: 'login success',
          return: {
            code: 0,
            data: {
              username: 'admin',
            },
          },
        },
        {
          name: 'scenario 2',
          desc: 'login failure',
          error: { code: 1, message: 'password incorrect' },
        },
      ],
    })(asyncFn)

    await mockFn()
    expect(listener).toBeCalledTimes(2)
  })
})
