// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import xhrMock from 'xhr-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'
import type { MockResponse } from 'xhr-mock'
import type { MockHeaders } from 'xhr-mock/lib/types'

import { onRun, matchNetworkRule } from './eventEmitter'
import { networkScenarioToResponse, NOOP, passRequest } from './utils'
import { realFetch } from './fetch'
import type { NetworkBeforeEvent, NetworkScenario } from './types'

let originalXHR: typeof XMLHttpRequest | null = null

const withResolveResponse =
  (resolve: (response: MockResponse) => void, resp: MockResponse) =>
  async (result: Response) => {
    const headers: MockHeaders = {}
    result.headers.forEach(
      (value: string, key: string) => (headers[key] = value),
    )
    resolve(
      resp
        .status(result.status)
        .reason(result.statusText)
        .headers(headers)
        .body(await result.text()),
    )
  }

const withResolveScenario =
  (resolve: (response: MockResponse) => void, resp: MockResponse) =>
  async (scenario: NetworkScenario) => {
    const scenarioResp = networkScenarioToResponse(scenario)
    withResolveResponse(resolve, resp)(scenarioResp)
  }

export const setupXHR = () => {
  if (originalXHR) {
    console.warn('Already setup XHR！')
    return NOOP
  }
  originalXHR = globalThis.XMLHttpRequest
  xhrMock.setup()
  xhrMock.use(
    (req, resp) =>
      new Promise((resolve, reject) => {
        const request = new Request(formatURL(req.url()), {
          method: req.method(),
          headers: req.headers(),
          body: req.body(),
        })

        const matchedRule = matchNetworkRule(request.url, request)
        if (!matchedRule) {
          realFetch!(request).then(withResolveResponse(resolve, resp))
          return
        }

        const baseDetail = {
          requestType: 'xhr' as const,
          rule: matchedRule,
          resolve: withResolveScenario(resolve, resp),
          reject: () => reject(),
        }

        const detail: NetworkBeforeEvent = {
          ...baseDetail,
          request: request.clone(),
          type: 'Run/network/before',
          timeStamp: new Date().getTime(),
          pass: (intercept = false) =>
            passRequest(
              {
                ...baseDetail,
                request: request.clone(),
                type: 'Run/network/after' as const,
                timeStamp: new Date().getTime(),
              },
              {
                resolveResponse: withResolveResponse(resolve, resp),
                intercept,
              },
            ),
        }

        onRun(detail)
      }),
  )

  return () => resetXHR()
}

export const resetXHR = () => {
  if (!originalXHR) {
    console.warn('please setUpXHR before resetXHR.')
    return
  }
  xhrMock.teardown()
  ;(globalThis as any).XMLHttpRequest = originalXHR
  originalXHR = null
}
