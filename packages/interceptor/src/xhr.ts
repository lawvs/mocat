// https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock
import xhrMock from 'xhr-mock'
import { formatURL } from 'xhr-mock/lib/MockURL'
import type { MockResponse } from 'xhr-mock'
import type { MockHeaders } from 'xhr-mock/lib/types'

import { onRun, matchNetworkRule } from './eventEmitter'
import { networkSceneToResponse, NOOP, passRequest } from './utils'
import { realFetch } from './fetch'
import type { NetworkBeforeEvent, NetworkScene } from './types'

let originalXHR: typeof XMLHttpRequest | null = null

const withResolveResponse = (
  resolve: (response: MockResponse) => void,
  resp: MockResponse
) => async (result: Response) => {
  const headers: MockHeaders = {}
  result.headers.forEach((value: string, key: string) => (headers[key] = value))
  resolve(
    resp
      .status(result.status)
      .reason(result.statusText)
      .headers(headers)
      .body(await result.text())
  )
}

const withResolveScene = (
  resolve: (response: MockResponse) => void,
  resp: MockResponse
) => async (scene: NetworkScene) => {
  const sceneResp = networkSceneToResponse(scene)
  withResolveResponse(resolve, resp)(sceneResp)
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
          request,
          resolve: withResolveScene(resolve, resp),
          reject: () => reject(),
        }

        const detail: NetworkBeforeEvent = {
          ...baseDetail,
          // id: new Date().getTime(),
          type: 'Run/network/before',
          pass: (intercept = false) =>
            passRequest(
              {
                ...baseDetail,
                type: 'Run/network/after' as const,
              },
              {
                resolveResponse: withResolveResponse(resolve, resp),
                intercept,
              }
            ),
        }

        onRun(detail)
      })
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
