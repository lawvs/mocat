import { setupFetch, setupXHR, log } from '@rabbit-mock/interceptor'
import { create as createUI } from '@rabbit-mock/ui'

export const create = ({ el = undefined, debug = false } = {}) => {
  if (debug) log()
  const resetFetch = setupFetch()
  const resetXHR = setupXHR()
  const ui = createUI()
  // eventEmitter.onAny(ui.hook.emit)
  return {
    mount: () => ui.mount({ el }),
    unmount: () => {
      resetFetch()
      resetXHR()
      ui.unmount()
    },
  }
}

export { mockRoute } from '@rabbit-mock/interceptor'
