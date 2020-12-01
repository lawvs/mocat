// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'

import { onRun, matchNetworkRule } from './eventEmitter'
import { networkScenarioToResponse, NOOP, passRequest } from './utils'
import type { NetworkBeforeEvent, NetworkScenario } from './types'

let originalFetch: typeof fetch | null = null

export const realFetch = (...args: Parameters<typeof fetch>) =>
  (originalFetch || fetch)(...args)

const withResolveScenario = (resolve: (response: Response) => void) => (
  scenario: NetworkScenario
) => resolve(networkScenarioToResponse(scenario))

export const setupFetch = () => {
  if (originalFetch) {
    console.warn('Already setup fetch！')
    return NOOP
  }
  originalFetch = globalThis.fetch.bind(window)
  const fetchMock = FetchMock.sandbox()
  globalThis.fetch = fetchMock as typeof globalThis.fetch

  fetchMock.config.overwriteRoutes = true
  fetchMock.mock(
    '*',
    (url, opts) =>
      new Promise((resolve: (result: Response) => void, reject) => {
        const request = new Request(url, opts)

        const matchedRule = matchNetworkRule(url, opts)
        if (!matchedRule) {
          realFetch(request).then((resp) => resolve(resp))
          return
        }

        const baseDetail = {
          requestType: 'fetch' as const,
          rule: matchedRule,
          request,
          resolve: withResolveScenario(resolve),
          reject: (error: any = new TypeError('Failed to fetch')) =>
            reject(error),
        }
        const detail: NetworkBeforeEvent = {
          // id: new Date().getTime(),
          ...baseDetail,
          type: 'Run/network/before',
          timeStamp: new Date().getTime(),
          pass: (intercept = false) => {
            passRequest(
              {
                ...baseDetail,
                type: 'Run/network/after',
                timeStamp: new Date().getTime(),
              },
              {
                resolveResponse: resolve,
                intercept,
              }
            )
          },
        }
        onRun(detail)
      })
  )
  return () => resetFetch()
}

export const resetFetch = () => {
  if (!originalFetch) {
    console.warn('please setupFetch before resetFetch.')
    return
  }
  globalThis.fetch = originalFetch
  originalFetch = null
}
