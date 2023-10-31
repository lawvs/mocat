import type { NetworkScenario, NetworkAfterEvent } from './types'
import { realFetch } from './fetch'
import { onRun } from './eventEmitter'

export const NOOP = () => {
  /*noop*/
}

// TODO fix type error
function needStringify(input: unknown): input is Record<string, any> | any[] {
  if (input === null || input === undefined) return false
  if (typeof input === 'number') return true
  if (Array.isArray(input)) return true
  // is pure object
  // eslint-disable-next-line no-prototype-builtins
  return Object.getPrototypeOf(input).isPrototypeOf(Object)
}

export const networkScenarioToResponse = (
  scenario: NetworkScenario,
): Response => {
  const data = needStringify(scenario.response)
    ? JSON.stringify(scenario.response)
    : scenario.response
  return new Response(data, {
    status: scenario.status,
    headers: scenario.headers,
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
  },
) => {
  try {
    const response = await realFetch(partialEvent.request)
    if (!intercept) {
      resolveResponse(response)
      return
    }
    const detail: NetworkAfterEvent = {
      ...partialEvent,
      response: response.clone(),
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
