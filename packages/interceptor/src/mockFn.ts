import { registerMock, onRun } from './eventEmitter'
import type {
  AsyncFnAfterEvent,
  AsyncFnBeforeEvent,
  AsyncFnRegister,
} from './types'

export const mockAsyncFn = (
  mock: Omit<AsyncFnRegister, 'type' | 'target' | 'timeStamp'> = {}
) => <T extends (...args: unknown[]) => Promise<unknown>>(targetFn: T): T => {
  const rule: AsyncFnRegister = {
    ...mock,
    type: 'Register/asyncFn',
    target: targetFn,
    timeStamp: new Date().getTime(),
  }
  registerMock(rule)

  return ((...args: Parameters<T>) =>
    new Promise((resolve, reject) => {
      const beforeEvent: AsyncFnBeforeEvent = {
        type: 'Run/asyncFn/before',
        target: targetFn,
        timeStamp: new Date().getTime(),
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
            timeStamp: new Date().getTime(),
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
