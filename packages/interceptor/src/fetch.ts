// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { registerMock, onRun } from './eventEmitter'
import type {
  NetworkBeforeEvent,
  NetWorkRegister,
  NetworkAfterEvent,
  NetworkScene,
} from './types'

const originalFetch = window.fetch.bind(window)

const networkRules: NetWorkRegister[] = []

const withResolveScene = (resolve: (response: Response) => void) => (
  scene: NetworkScene
) => {
  // TODO enhance type
  const data =
    typeof scene.response === 'object' || typeof scene.response === 'number'
      ? JSON.stringify(scene.response)
      : scene.response
  const resp = new Response(data, {
    status: scene.status,
    headers: scene.headers,
  })
  resolve(resp)
}

const matchNetworkRule = (
  targetUrl: string,
  opts: FetchMock.MockRequest
): NetWorkRegister | undefined =>
  networkRules.find(({ url, method }) => {
    if (method !== '*' && opts.method !== method) {
      return
    }
    if (typeof url === 'function') {
      return url(targetUrl)
    }
    if (typeof url === 'string') {
      return targetUrl.includes(url)
    }
    return url.test(targetUrl)
  })

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
    const response = await originalFetch(request)
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
    const detail: NetworkAfterEvent = {
      ...baseEvent,
      error,
      pass: () => reject(error),
    }
    onRun(detail)
  }
}

export const setUpFetch = () => {
  const fetchMock = FetchMock.sandbox()
  window.fetch = fetchMock as typeof window.fetch

  fetchMock.config.overwriteRoutes = true
  fetchMock.mock(
    '*',
    (url, opts) =>
      new Promise((resolve: (result: Response) => void, reject) => {
        const request = new Request(url, opts)

        const matchedRule = matchNetworkRule(url, opts)
        if (!matchedRule) {
          originalFetch(request).then((resp) => resolve(resp))
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
}

export const resetFetch = () => {
  window.fetch = originalFetch
}

const defaultRoute: NetWorkRegister = {
  type: 'Register/networkRoute',
  method: '*',
  url: '*',
}

export const registerNetworkRoute = (
  route: Omit<NetWorkRegister, 'type' | 'method'>
) => {
  const innerRoute: NetWorkRegister = {
    ...defaultRoute,
    ...route,
    type: 'Register/networkRoute',
  }
  networkRules.unshift(innerRoute)
  registerMock({
    ...defaultRoute,
    ...route,
    method: innerRoute.method.toUpperCase(),
  })
}
