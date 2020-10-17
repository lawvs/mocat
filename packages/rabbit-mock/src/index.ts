import {
  eventEmitter,
  setupFetch,
  setupXHR,
  log,
} from '@rabbit-mock/interceptor'
import { create as createUI } from '@rabbit-mock/ui'
import type { UIOptions } from '@rabbit-mock/ui'

export interface RabbitMockOptions extends UIOptions {
  debug?: boolean
}

export const create = ({
  debug = false,

  ...uiOptions
}: RabbitMockOptions = {}) => {
  if (debug) log()
  const resetFetch = setupFetch()
  const resetXHR = setupXHR()
  const ui = createUI({ eventEmitter, ...uiOptions })
  // eventEmitter.onAny(ui.hook.emit)
  return {
    unmount: () => {
      resetFetch()
      resetXHR()
      ui.unmount()
    },
  }
}

export { mockRoute, mockRoutes } from '@rabbit-mock/interceptor'
