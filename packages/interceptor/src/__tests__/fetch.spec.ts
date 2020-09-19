// polyfill jest fetch
// https://github.com/node-fetch/node-fetch
import * as nodeFetch from 'node-fetch'

import { setupFetch, resetFetch } from '../fetch'
import { eventEmitter, mockRoute } from '../eventEmitter'

beforeAll(() => {
  if (!globalThis.fetch) {
    ;(globalThis as any).fetch = nodeFetch
    ;(globalThis as any).Response = nodeFetch.Response
    ;(globalThis as any).Headers = nodeFetch.Headers
    ;(globalThis as any).Request = nodeFetch.Request
  }

  setupFetch()
})

afterAll(() => {
  resetFetch()
})

describe('fetch', () => {
  beforeAll(() => {
    mockRoute({ url: '/' })
  })

  test('should fetch works', async () => {
    const listener = jest.fn((payload) => payload.resolve({ response: 1 }))
    eventEmitter.once('Run/network/before', listener)
    const resp = await fetch('/')
    const data = await resp.text()

    expect(resp.status).toEqual(200)
    expect(data).toEqual('1')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with status', async () => {
    const listener = jest.fn((payload) => payload.resolve({ status: 400 }))
    eventEmitter.once('Run/network/before', listener)
    const resp = await fetch('/')

    expect(resp.status).toEqual(400)
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with header', async () => {
    const listener = jest.fn((payload) =>
      payload.resolve({ headers: { status: 204 } })
    )
    eventEmitter.once('Run/network/before', listener)
    const resp = await fetch('/')

    expect(resp.headers.get('status')).toEqual('204')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with empty response', async () => {
    const listener = jest.fn((payload) => payload.resolve({}))
    eventEmitter.once('Run/network/before', listener)
    const resp = await fetch('/')
    const data = await resp.text()

    expect(data).toEqual('')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with json', async () => {
    const data = { code: 1, msg: 'success' }
    const listener = jest.fn((payload) => payload.resolve({ response: data }))

    eventEmitter.once('Run/network/before', listener)

    expect((await fetch('/')).json()).resolves.toEqual(data)
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works when reject', async () => {
    const listener = jest.fn((payload) => payload.reject())
    eventEmitter.once('Run/network/before', listener)

    expect(fetch('/')).rejects.toThrowError('Failed to fetch')
    expect(listener).toBeCalledTimes(1)
  })
})

describe('snapshot test', () => {
  test('should register route match snapshot', () => {
    const listener = jest.fn((payload) => expect(payload).toMatchSnapshot())
    eventEmitter.on('Register/networkRoute', listener)
    mockRoute({
      name: 'login',
      desc: 'login api',
      url: '/api/login',
      scenes: [
        {
          name: 'login success',
          response: { code: 0, username: 'admin' },
        },
        {
          name: 'login failure',
          desc: 'password incorrect',
          status: 400,
          response: { code: 1, message: 'password incorrect' },
        },
      ],
    })
    expect(listener).toBeCalledTimes(1)
  })

  test('should network before event match snapshot', async () => {
    mockRoute({ url: '/' })
    const listener = jest.fn((payload) => expect(payload).toMatchSnapshot())
    eventEmitter.on('Run/network/before', listener)

    fetch('/')
    expect(listener).toBeCalledTimes(1)
  })
})
