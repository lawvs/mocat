// polyfill jest fetch
// https://github.com/node-fetch/node-fetch
import * as nodeFetch from 'node-fetch'

import { eventEmitter, registerNetworkRoute } from '../eventEmitter'
import { setupXHR, resetXHR } from '../xhr'

beforeAll(() => {
  if (!globalThis.fetch) {
    ;(globalThis as any).fetch = nodeFetch
    ;(globalThis as any).Response = nodeFetch.Response
    ;(globalThis as any).Headers = nodeFetch.Headers
    ;(globalThis as any).Request = nodeFetch.Request
  }

  setupXHR()
})

afterAll(() => {
  resetXHR()
})

const xhrRequest = (url: string, method = 'GET'): Promise<XMLHttpRequest> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr)
      }
    }

    xhr.onerror = (e) => reject(e)
    xhr.open(method, url)
    xhr.send()
  })

describe('xhr', () => {
  beforeAll(() => {
    registerNetworkRoute({ url: '/' })
  })

  test('should xhr works', async () => {
    const listener = jest.fn((payload) => payload.resolve({ response: 1 }))
    eventEmitter.once('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.status).toEqual(200)
    expect(xhr.statusText).toEqual('OK')
    expect(xhr.responseText).toEqual('1')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with status', async () => {
    const listener = jest.fn((payload) => payload.resolve({ status: 400 }))
    eventEmitter.once('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.status).toEqual(400)
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with header', async () => {
    const listener = jest.fn((payload) =>
      payload.resolve({ headers: { 'Content-Type': 'application/json' } })
    )
    eventEmitter.once('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.getResponseHeader('Content-Type')).toEqual('application/json')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works with empty response', async () => {
    const listener = jest.fn((payload) => payload.resolve({}))
    eventEmitter.once('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.responseText).toEqual('')
    expect(listener).toBeCalledTimes(1)
  })

  test('should fetch works when reject', async () => {
    const listener = jest.fn((payload) => payload.reject())
    eventEmitter.once('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.readyState).toEqual(XMLHttpRequest.DONE)
    expect(xhr.status).toEqual(0)
    expect(xhr.statusText).toEqual('')
    expect(xhr.responseText).toEqual('')
    expect(listener).toBeCalledTimes(1)
  })
})
