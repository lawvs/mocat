import { registerMock, onRun } from './eventEmitter'
import type {
  AsyncFnAfterEvent,
  AsyncFnBeforeEvent,
  AsyncFnRegister,
} from './types'

type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  {
    [P in K]?: T[P]
  }

export const mockAsyncFn = (
  mock: PartialKeys<
    Omit<AsyncFnRegister, 'type' | 'target' | 'timeStamp'>,
    'scenarios'
  > = {}
) => <T extends (...args: unknown[]) => Promise<unknown>>(targetFn: T): T => {
  const rule: AsyncFnRegister = {
    scenarios: [],
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
