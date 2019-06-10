// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import XHRMock from 'xhr-mock'
// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'

interface Options {
  debug?: boolean
  eventPrefix: string
}

interface RabbitRequest {
  id: number
  type: 'FETCH' | 'XHR'
  request: Request
  resolve: (data: object | Response) => void
  reject: (err: Error) => void
  pass: () => void
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
    } else {
      console.warn('RabbitMock instance existed!')
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
          const resolveResponse = (resp: object | Response) => {
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
                .body(resp.text),
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
            reject,
            pass: async () => {
              const resp = await this.originalFetch(request)
              const text = await resp.text
              resolve(res.status(resp.status).body(text))
            },
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
            pass: async () => {
              const resp = await this.originalFetch(request)
              resolve(resp)
            },
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
}

export default Rabbit
