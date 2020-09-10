// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import XHRMock from 'xhr-mock'
// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'
import type { MockHeaders } from 'xhr-mock/lib/types'

export interface RabbitRequest {
  id: number
  type: 'FETCH' | 'XHR'
  request: Request
  resolve: (data: Record<string, unknown> | Response) => void
  reject: (err: Error) => void
  pass: (option?: {
    request?: Request
    intercept?: boolean
    // resolve?: (data: Record<string, unknown> | Response) => void
    // reject?: (err: Error) => void
  }) => void
}

export interface RabbitResponse {
  id: number
  request: Request
  response: Response | undefined
  error: Error | undefined
  resolve: (data: Response) => void
  reject: (err: Error) => void
  pass: () => void
}

export type Rabbit = RabbitRequest | RabbitResponse

export interface Options {
  debug?: boolean
  eventPrefix?: string
}

const DEFAULT_RABBIT_OPTIONS: Options = {
  debug: false,
  eventPrefix: 'rabbit',
}

// Single instance
let instance: RabbitMock | null = null

class RabbitMock {
  options: Options
  originalXhr: any
  originalFetch: typeof window.fetch
  fetchMock = FetchMock.sandbox()
  xhrMock = XHRMock
  status = false // TODO fix status incorrect

  constructor(options?: Options) {
    if (!instance) {
      instance = this
    }
    this.options = {
      ...DEFAULT_RABBIT_OPTIONS,
      ...options,
    }

    // backup
    if ((window as any).XMLHttpRequest) {
      this.originalXhr = (window as any).XMLHttpRequest
    }
    this.originalFetch = window.fetch.bind(window)
    return instance
  }

  setup() {
    // eslint-disable-next-line no-console
    this.options.debug && console.log('[DEBUG] Rabbit Setup!')
    if (this.status) {
      console.warn('RabbitMock has been setup!')
      return
    }
    if (((window as any) as any).XMLHttpRequest) {
      this.setUpXhr()
    }
    this.setUpFetch()
    this.status = true
    return true
  }

  setUpXhr() {
    this.xhrMock.setup()
    this.xhrMock.use(
      (req, res) =>
        new Promise((resolve, reject) => {
          const resolveResponse = async (
            resp: Record<string, unknown> | Response
          ) => {
            if (!(resp instanceof Response)) {
              resolve(res.status(200).body(resp))
              return
            }
            const headers: MockHeaders = {}
            resp.headers.forEach(
              (value: string, key: string) => (headers[key] = value)
            )
            resolve(
              res
                .status(resp.status)
                .reason(resp.statusText)
                .headers(headers)
                .body(await resp.text())
            )
          }
          const request = new Request(formatURL(req.url()), {
            method: req.method(),
            headers: req.headers(),
            body: req.body(),
          })
          const detail: RabbitRequest = {
            id: new Date().getTime(),
            type: 'XHR',
            request,
            resolve: resolveResponse,
            reject, // TODO reject xhr
            pass: (options) =>
              this.passRequest({
                request,
                resolve: resolveResponse,
                reject,
                ...options,
              }),
          }

          this.emit(`${this.options.eventPrefix}.request`, detail)
        })
    )
  }

  setUpFetch() {
    this.fetchMock.config.overwriteRoutes = true
    this.fetchMock.mock(
      '*',
      (url, opts) =>
        new Promise((resolve, reject) => {
          const request = new Request(url, opts)
          const detail: RabbitRequest = {
            id: new Date().getTime(),
            type: 'FETCH',
            request,
            resolve,
            reject: () => reject(new TypeError('Failed to fetch')),
            pass: (options) =>
              this.passRequest({ request, resolve, reject, ...options }),
          }
          this.emit(`${this.options.eventPrefix}.request`, detail)
        })
    )
    window.fetch = this.fetchMock as typeof window.fetch
  }

  teardown() {
    if (!this.status) {
      console.warn('RabbitMock has been teardown!')
      return
    }
    // eslint-disable-next-line no-console
    this.options.debug && console.log('[DEBUG] Rabbit Teardown!')

    if ((window as any).XMLHttpRequest) {
      this.teardownXhr()
    }
    this.teardownFetch()
    this.status = false
  }

  teardownXhr() {
    this.xhrMock.teardown()
  }

  teardownFetch() {
    this.fetchMock.reset()
    this.fetchMock.resetBehavior()
    window.fetch = this.originalFetch
  }

  async passRequest({
    request,
    resolve,
    reject,
    intercept = false,
  }: {
    request: Request
    resolve: (response: Response) => void
    reject: (error: Error) => void
    intercept?: boolean
  }) {
    let response: Response | undefined
    let error: Error | undefined
    try {
      response = await this.originalFetch(request)
    } catch (e) {
      error = e
    }

    if (!intercept) {
      response && resolve(response)
      error && reject(error) // TODO fix error type
      return
    }
    const detail: RabbitResponse = {
      id: new Date().getTime(),
      request,
      response,
      error,
      resolve,
      reject,
      pass: () => {
        response && resolve(response)
        error && reject(error)
      },
    }
    this.emit(`${this.options.eventPrefix}.response`, detail)
  }

  emit(eventName: string, detail: Rabbit) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail,
    })
    window.dispatchEvent(event)
    // eslint-disable-next-line no-console
    this.options.debug && console.log('[DEBUG]', eventName, detail)
  }
}

export default RabbitMock
