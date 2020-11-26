import {
  mockRoute,
  mockRoutes,
  eventEmitter,
  setupFetch,
  setupXHR,
  log,
} from '@mocat/interceptor'
import { create as createUI } from '@mocat/ui'
import type { UIOptions } from '@mocat/ui'

export interface MocatOptions extends UIOptions {
  debug?: boolean
}

export const create = ({ debug = false, ...uiOptions }: MocatOptions = {}) => {
  if (debug) log()
  const resetFetch = setupFetch()
  const resetXHR = setupXHR()
  const ui = createUI({ eventEmitter, ...uiOptions })
  // eventEmitter.onAny(ui.hook.emit)
  return {
    mockRoute,
    mockRoutes,
    unmount: () => {
      resetFetch()
      resetXHR()
      ui.unmount()
    },
  }
}

export type { MockRoute } from '@mocat/interceptor'
export const version = process.env.VERSION
