// http://www.wheresrhys.co.uk/fetch-mock/
import FetchMock from 'fetch-mock'
import { registerMock, onRun } from './eventEmitter'
import type {
  NetworkBeforeEvent,
  NetWorkRegister,
  NetworkAfterEvent,
} from './types'

const originalFetch = window.fetch.bind(window)

const networkRules: NetWorkRegister[] = []

const matchNetworkRule = (
  targetUrl: string,
  opts: FetchMock.MockRequest
): NetWorkRegister | undefined => {
  return networkRules.find(({ url, method }) => {
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
}

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
  try {
    const response = await originalFetch(request)
    if (!intercept) {
      response && resolve(response)
      return
    }
    const detail: NetworkAfterEvent = {
      // id: new Date().getTime(),
      type: 'Run/network/after',
      requestType: 'fetch',
      rule,
      request,
      response,
      resolve,
      reject,
      pass: () => resolve(response),
    }
    onRun(detail)
  } catch (error) {
    const detail: NetworkAfterEvent = {
      // id: new Date().getTime(),
      type: 'Run/network/after',
      requestType: 'fetch',
      rule,
      request,
      error,
      resolve,
      reject,
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
      new Promise((resolve, reject) => {
        const request = new Request(url, opts)

        const matchedRule = matchNetworkRule(url, opts)
        if (!matchedRule) {
          resolve(originalFetch(request))
          return
        }

        const detail: NetworkBeforeEvent = {
          // id: new Date().getTime(),
          requestType: 'fetch',
          type: 'Run/network/before',
          rule: matchedRule,
          request,
          resolve,
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
