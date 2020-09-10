import type { NetworkScene, NetworkAfterEvent } from './types'
import { realFetch } from './fetch'
import { onRun } from './eventEmitter'

export const NOOP = () => {
  /*noop*/
}

// TODO fix type error
function isPureObject(input: any): input is Record<any, any> {
  if (input === null || input === undefined) return false
  // eslint-disable-next-line no-prototype-builtins
  return Object.getPrototypeOf(input).isPrototypeOf(Object)
}

export const networkSceneToResponse = (scene: NetworkScene): Response => {
  const data =
    isPureObject(scene.response) || typeof scene.response === 'number'
      ? JSON.stringify(scene.response)
      : scene.response
  return new Response(data, {
    status: scene.status,
    headers: scene.headers,
  })
}

export const passRequest = async (
  partialEvent: Omit<NetworkAfterEvent, 'pass' | 'error'>,
  {
    intercept,
    resolveResponse,
  }: {
    intercept: boolean
    resolveResponse: (result: Response) => void
  }
) => {
  try {
    const response = await realFetch(partialEvent.request)
    if (!intercept) {
      resolveResponse(response)
      return
    }
    const detail: NetworkAfterEvent = {
      ...partialEvent,
      response,
      pass: () => resolveResponse(response),
    }
    onRun(detail)
  } catch (error) {
    if (!intercept) {
      partialEvent.reject(error)
      return
    }

    const errorDetail: NetworkAfterEvent = {
      ...partialEvent,
      error,
      pass: () => partialEvent.reject(error),
    }
    onRun(errorDetail)
  }
}
