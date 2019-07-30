// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import XHRMock from 'xhr-mock'
// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'

interface Options {
  debug?: boolean
  eventPrefix?: string
}

interface RabbitRequest {
  id: number
  type: 'FETCH' | 'XHR'
  request: Request
  resolve: (data: object | Response) => void
  reject: (err: Error) => void
  pass: (option?: {
    request?: Request
    intercept?: boolean
    // resolve?: (data: object | Response) => void
    // reject?: (err: Error) => void
  }) => void
}

const DEFAULT_RABBIT_OPTIONS: Options = {
  debug: false,
  eventPrefix: 'rabbit',
}

// Single instance
let instance: Rabbit | null = null

class Rabbit {
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
    if ((<any>window).XMLHttpRequest) {
      this.originalXhr = (<any>window).XMLHttpRequest
    }
    this.originalFetch = window.fetch.bind(window)
    return instance
  }

  setup() {
    if (this.status) {
      console.warn('RabbitMock has been setup!')
      return
    }
    if ((<any>window).XMLHttpRequest) {
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
          const resolveResponse = async (resp: object | Response) => {
            if (!(resp instanceof Response)) {
              resolve(res.status(200).body(resp))
              return
            }
            resolve(
              res
                .status(resp.status)
                .reason(resp.statusText)
                .headers(
                  // TODO fix type
                  [...(<any>resp.headers).entries()].reduce(
                    (pre, cur) => ({ ...pre, [cur[0]]: cur[1] }),
                    {},
                  ),
                )
                .body(await resp.text()),
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
            pass: options =>
              this.passRequest({ request, resolve: resolveResponse, reject, ...options }),
          }
          const event = new CustomEvent(`${this.options.eventPrefix}.request`, {
            bubbles: true,
            cancelable: true,
            detail,
          })
          window.dispatchEvent(event)
        }),
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
            pass: options => this.passRequest({ request, resolve, reject, ...options }),
          }
          const event = new CustomEvent(`${this.options.eventPrefix}.request`, {
            bubbles: true,
            cancelable: true,
            detail,
          })
          window.dispatchEvent(event)
        }),
    )
    window.fetch = this.fetchMock as typeof window.fetch
  }

  teardown() {
    if (!this.status) {
      console.warn('RabbitMock has been teardown!')
      return
    }

    if ((<any>window).XMLHttpRequest) {
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
    const detail = {
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
    const event = new CustomEvent(`${this.options.eventPrefix}.response`, {
      bubbles: true,
      cancelable: true,
      detail,
    })
    window.dispatchEvent(event)
  }
}

export default Rabbit
