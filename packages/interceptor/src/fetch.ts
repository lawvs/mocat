// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'

import { onRun, matchNetworkRule } from './eventEmitter'
import { networkSceneToResponse, NOOP, passRequest } from './utils'
import type { NetworkBeforeEvent, NetworkScene } from './types'

let originalFetch: typeof fetch | null = null

export const realFetch = (...args: Parameters<typeof fetch>) =>
  (originalFetch || fetch)(...args)

const withResolveScene = (resolve: (response: Response) => void) => (
  scene: NetworkScene
) => resolve(networkSceneToResponse(scene))

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
          resolve: withResolveScene(resolve),
          reject: (error: any = new TypeError('Failed to fetch')) =>
            reject(error),
        }
        const detail: NetworkBeforeEvent = {
          // id: new Date().getTime(),
          ...baseDetail,
          type: 'Run/network/before',
          pass: (intercept = false) => {
            passRequest(
              {
                ...baseDetail,
                type: 'Run/network/after',
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
