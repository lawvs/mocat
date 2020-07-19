import { emit } from './eventEmitter'

export const mockAsync = (...actions: object[]) => (
  mockFn: (...args: any[]) => Promise<any>
) => {
  // registerMock({ target: mockFn, actions })

  return async (...args: any) =>
    new Promise((resolve, reject) => {
      emit('mockAsync.before', {
        target: mockFn,
        resolve,
        reject,
        pass: async (interceptReturn = false) => {
          let originResult: any
          let error: Error | undefined = undefined
          try {
            originResult = await mockFn(...args)
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

          emit('mockAsync.after', {
            target: mockFn,
            originResult,
            error,
            resolve,
            reject,
            pass: passReturn,
          })
        },
      })
    })
}
