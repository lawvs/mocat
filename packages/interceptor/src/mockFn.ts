import { registerMock, onRun } from './eventEmitter'
import type {
  AsyncFnAfterEvent,
  AsyncFnBeforeEvent,
  AsyncFnRegister,
} from './types'

export const mockAsyncFn = (
  mock: Omit<AsyncFnRegister, 'type' | 'target'> = {}
) => <T extends (...args: unknown[]) => Promise<unknown>>(targetFn: T): T => {
  const rule: AsyncFnRegister = {
    ...mock,
    type: 'Register/asyncFn',
    target: targetFn,
  }
  registerMock(rule)

  return ((...args: Parameters<T>) =>
    new Promise((resolve, reject) => {
      const beforeEvent: AsyncFnBeforeEvent = {
        type: 'Run/asyncFn/before',
        target: targetFn,
        rule,
        resolve,
        reject,
        pass: async (interceptReturn = false) => {
          let originResult: unknown
          let error: Error | undefined = undefined
          try {
            originResult = await targetFn(...args)
          } catch (e) {
            error = e
          }

          const passReturn = () => {
            if (error) {
              reject(error)
              return
            }
            resolve(originResult)
          }
          if (!interceptReturn) {
            passReturn()
            return
          }

          const afterEvent: AsyncFnAfterEvent = {
            type: 'Run/asyncFn/after',
            target: targetFn,
            rule,
            result: originResult,
            error,
            resolve,
            reject,
            pass: passReturn,
          }

          onRun(afterEvent)
        },
      }

      onRun(beforeEvent)
    })) as T
}
