// polyfill jest fetch
// https://github.com/node-fetch/node-fetch
import * as nodeFetch from 'node-fetch'

jest.useFakeTimers('modern')
jest.setSystemTime(0)

if (!globalThis.fetch) {
  ;(globalThis as any).fetch = nodeFetch
  ;(globalThis as any).Response = nodeFetch.Response
  ;(globalThis as any).Headers = nodeFetch.Headers
  ;(globalThis as any).Request = nodeFetch.Request
}
