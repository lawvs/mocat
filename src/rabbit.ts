// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import XHRMock from 'xhr-mock'
// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'

interface Options {
  readonly debug?: boolean
}

const DEFAULT_RABBIT_OPTIONS: Options = {
  debug: false,
}

class Rabbit {
  options: Options
  originalXhr: any
  originalFetch: typeof window.fetch
  fetchMock = FetchMock.sandbox()
  xhrMock = XHRMock
  status = false

  constructor(options?: Options) {
    this.options = {
      ...DEFAULT_RABBIT_OPTIONS,
      ...options,
    }

    // backup
    if ((<any>window).XMLHttpRequest) {
      this.originalXhr = (<any>window).XMLHttpRequest
    }
    this.originalFetch = window.fetch
  }

  setup() {
    if ((<any>window).XMLHttpRequest) {
      this.setUpXhr()
      // ;(<any>window).XMLHttpRequest = this.xhrMock
    }
    this.setUpFetch()
    this.status = true
    return true
  }

  setUpXhr(): void {
    this.xhrMock.setup()
    this.xhrMock.use((req, res) => res.status(200).body('{"hello": "xhrMock"}'))
  }

  setUpFetch(): void {
    this.fetchMock.config.overwriteRoutes = true

    this.fetchMock.get('*', { hello: 'fetchMock' })
    window.fetch = this.fetchMock as typeof window.fetch
  }

  teardown() {
    this.xhrMock.teardown()
    this.fetchMock.reset()
    this.fetchMock.resetBehavior()
    window.fetch = this.originalFetch
    this.status = false
  }
}

export default Rabbit
