// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'

import { onRun, matchNetworkRule } from './eventEmitter'
import type {
  NetworkBeforeEvent,
  NetWorkRegister,
  NetworkAfterEvent,
  NetworkScene,
} from './types'
import { networkSceneToResponse, NOOP } from './utils'

let originalFetch: typeof fetch | null = null

export const realFetch = (...args: Parameters<typeof fetch>) =>
  (originalFetch || fetch)(...args)

const withResolveScene = (resolve: (response: Response) => void) => (
  scene: NetworkScene
) => resolve(networkSceneToResponse(scene))

const passRequest = async ({
  request,
  resolve,
  reject,
  rule,
  intercept,
}: {
  request: Request
  resolve: (response: Response) => void
  reject: (error: Error) => void
  rule: NetWorkRegister
  intercept?: boolean
}) => {
  const baseEvent = {
    // id: new Date().getTime(),
    type: 'Run/network/after' as const,
    requestType: 'fetch' as const,
    rule,
    request,
    resolve: withResolveScene(resolve),
    reject,
  }

  try {
    const response = await realFetch(request)
    if (!intercept) {
      resolve(response)
      return
    }
    const detail: NetworkAfterEvent = {
      ...baseEvent,
      response,
      pass: () => resolve(response),
    }
    onRun(detail)
  } catch (error) {
    if (!intercept) {
      reject(error)
      return
    }

    const errorDetail: NetworkAfterEvent = {
      ...baseEvent,
      error,
      pass: () => reject(error),
    }
    onRun(errorDetail)
  }
}

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

        const detail: NetworkBeforeEvent = {
          // id: new Date().getTime(),
          requestType: 'fetch',
          type: 'Run/network/before',
          rule: matchedRule,
          request,
          resolve: withResolveScene(resolve),
          reject: (error = new TypeError('Failed to fetch')) => reject(error),
          pass: (intercept = false) =>
            passRequest({
              request,
              resolve,
              reject: (error = new TypeError('Failed to fetch')) =>
                reject(error),
              rule: matchedRule,
              intercept,
            }),
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
