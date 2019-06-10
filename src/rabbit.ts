// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import XHRMock from 'xhr-mock'
// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'

interface Options {
  readonly debug?: boolean
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
      // ;(<any>window).XMLHttpRequest = this.xhrMock
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
          const resolveData = (data: any) => resolve(res.status(200).body(data))
          const request = new Request(formatURL(req.url()), {
            method: req.method(),
            headers: req.headers(),
            body: req.body(),
          })
          this.queue.push({
            id: new Date().getTime(),
            type: 'XHR',
            request,
            resolve: resolveData,
            reject,
            pass: async () => {
              const resp = await this.originalFetch(request)
              const text = await resp.text
              resolve(res.status(resp.status).body(text))
            },
          })
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
          this.queue.push({
            id: new Date().getTime(),
            type: 'FETCH',
            request,
            resolve,
            reject,
            pass: async () => {
              const resp = await this.originalFetch(request)
              resolve(resp)
            },
          })
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
    this.queue = [] // clear
  }
}

export default Rabbit
