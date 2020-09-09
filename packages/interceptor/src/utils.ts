import type { NetworkScene } from './types'

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
