// See https://github.com/EventEmitter2/EventEmitter2
import { EventEmitter2 } from 'eventemitter2'
import type { EventAndListener } from 'eventemitter2'
import type {
  MockEventMap,
  RegisterEvent,
  RunEvent,
  NetWorkRegister,
} from './types'

export interface MockEventEmitter {
  emit<T extends keyof MockEventMap>(event: T, value: MockEventMap[T]): boolean

  on<T extends keyof MockEventMap>(
    event: T,
    listener: (value: MockEventMap[T]) => void
  ): void
  once<T extends keyof MockEventMap>(
    event: T,
    listener: (value: MockEventMap[T]) => void
  ): void
  onAny<T extends keyof MockEventMap>(
    listener: (event: T, value: MockEventMap[T]) => void
  ): void
  off<T extends keyof MockEventMap>(
    event: T,
    listener: (...values: any[]) => void
  ): this
  offAny(listener: (value: any[]) => void): this
}

// @ts-ignore
export const eventEmitter: MockEventEmitter = new EventEmitter2()

export const log = () => {
  const logListener: EventAndListener = (event, ...payload) =>
    // eslint-disable-next-line no-console
    console.log(
      `%cReceive%c %c${event.toString()}`,
      'background: rgba(0, 255, 255, 0.6); color: black; padding: 0px 6px; border-radius: 4px;',
      '',
      'text-decoration: underline',
      payload
    )
  eventEmitter.onAny(logListener)
  return () => eventEmitter.offAny(logListener)
}

// Register event

// const mockMap = new Map<any, any>()

export const registerMock = (rule: RegisterEvent) => {
  // mockMap.set(target, { desc, scenes })
  eventEmitter.emit(rule.type, rule)
}

const defaultRoute: NetWorkRegister = {
  type: 'Register/networkRoute',
  method: '*',
  url: '*',
}

const networkRules: NetWorkRegister[] = []

export const matchNetworkRule = (
  targetUrl: string,
  opts: { method?: string }
): NetWorkRegister | undefined =>
  networkRules.find(({ url, method }) => {
    if (method !== '*' && opts.method !== method) {
      return
    }
    if (typeof url === 'function') {
      return url(targetUrl)
    }
    if (typeof url === 'string') {
      return targetUrl.includes(url)
    }
    return url.test(targetUrl)
  })

export const registerNetworkRoute = (
  route: Omit<NetWorkRegister, 'type' | 'method'>
) => {
  const innerRoute: NetWorkRegister = {
    ...defaultRoute,
    ...route,
    type: 'Register/networkRoute',
  }
  networkRules.unshift(innerRoute)
  registerMock({
    ...defaultRoute,
    ...route,
    method: innerRoute.method.toUpperCase(),
  })
}

// Run event

export const onRun = (event: RunEvent) => {
  eventEmitter.emit(event.type, event)
}
