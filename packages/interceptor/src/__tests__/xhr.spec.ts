import { eventEmitter, mockRoute } from '../eventEmitter'
import { setupXHR, resetXHR } from '../xhr'

beforeAll(() => {
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
        if (xhr.status) {
          resolve(xhr)
        }
      }
    }

    xhr.onerror = (e) => reject(e)
    xhr.open(method, url)
    xhr.send()
  })

describe('xhr', () => {
  beforeAll(() => {
    mockRoute({ url: '/' })
  })

  beforeEach(() => {
    // @ts-ignore
    eventEmitter.removeAllListeners()
  })

  test('should xhr works', async () => {
    const listener = jest.fn((payload) => payload.resolve({ response: 1 }))
    eventEmitter.on('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.status).toEqual(200)
    expect(xhr.statusText).toEqual('OK')
    expect(xhr.response).toEqual('1')
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works with status', async () => {
    const listener = jest.fn((payload) => payload.resolve({ status: 400 }))
    eventEmitter.on('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.status).toEqual(400)
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works with header', async () => {
    const listener = jest.fn((payload) =>
      payload.resolve({ headers: { 'Content-Type': 'application/json' } }),
    )
    eventEmitter.on('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.getResponseHeader('Content-Type')).toEqual('application/json')
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works with empty response', async () => {
    const listener = jest.fn((payload) => payload.resolve({}))
    eventEmitter.on('Run/network/before', listener)
    const xhr = await xhrRequest('/')

    expect(xhr.response).toEqual('')
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works with json', async () => {
    const data = { code: 1, msg: 'success' }
    const listener = jest.fn((payload) => payload.resolve({ response: data }))
    eventEmitter.on('Run/network/before', listener)

    const xhr = await xhrRequest('/')
    expect(xhr.response).toEqual(JSON.stringify(data))
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works with array json', async () => {
    const data = [{ data: 1, msg: 'success' }, { data: 2 }]
    const listener = jest.fn((payload) => payload.resolve({ response: data }))
    eventEmitter.on('Run/network/before', listener)
    const xhr = await xhrRequest('/')
    expect(xhr.response).toEqual(JSON.stringify(data))
    expect(listener).toBeCalledTimes(1)
  })

  test('should xhr works when reject', async () => {
    const listener = jest.fn((payload) => payload.reject())
    eventEmitter.on('Run/network/before', listener)
    try {
      await xhrRequest('/')
      fail('Unreachable')
    } catch (error) {
      expect(error).toMatchObject({ type: 'error' })
    }

    expect(listener).toBeCalledTimes(1)
  })
})
