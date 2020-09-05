/**
 * Hack literal union
 *
 * See https://github.com/microsoft/typescript/issues/29729
 * See https://github.com/sindresorhus/type-fest/blob/master/source/literal-union.d.ts
 */
export type LiteralUnion<T extends U, U = string> = T | (U & { _?: never })

interface Comment {
  name?: string
  desc?: string
}

// Scene

export interface FnScene extends Comment {
  pass?: boolean
  return?: any
  error?: any
  // implementation?: (...args: any[]) => any
}

export interface NetworkScene extends Comment {
  /**
   * @default 200
   */
  status?: number
  headers?: Record<string, string>
  // cookie?: string
  /** Response body */
  response?: any
  error?: any
}

// Mock Register

export interface NetWorkRegister extends Comment {
  type: 'Register/networkRoute'
  /** String or RegExp url to match against request urls */
  url: string | RegExp | ((url: string) => boolean)
  method: LiteralUnion<
    'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'HEAD' | 'TRACE' | 'CONNECT'
  >
  scenes?: NetworkScene[]
}

export interface AsyncFnRegister extends Comment {
  type: 'Register/asyncFn'
  target: (...args: any) => Promise<any>
  scenes?: FnScene[]
}

export interface SyncFnRegister extends Comment {
  type: 'Register/syncFn'
  target: (...args: any) => any
  mockFn: {
    mockReset: () => void
    mockReturnValue: (value: any) => void
    mockImplementation: (...args: any) => any
  }
  scenes?: FnScene[]
}

type FnRegister = AsyncFnRegister | SyncFnRegister

export type MockRegister = NetWorkRegister | FnRegister

// Run Event

export interface NetworkBeforeEvent {
  type: 'Run/network/before'
  requestType: 'xhr' | 'fetch'
  rule: NetWorkRegister
  request: Request
  resolve: (result: NetworkScene) => void
  reject: (error?: any) => void
  pass: (interceptReturn: boolean) => void
}

interface NetworkAfterCommon {
  type: 'Run/network/after'
  requestType: 'xhr' | 'fetch'
  rule: NetWorkRegister
  request: Request
  resolve: (result: NetworkScene) => void
  reject: (error?: any) => void
  pass: () => void
}
interface NetworkSuccessEvent extends NetworkAfterCommon {
  response: Response
}
interface NetworkFailureEvent extends NetworkAfterCommon {
  error: unknown
}

export type NetworkAfterEvent = NetworkSuccessEvent | NetworkFailureEvent

export interface AsyncFnBeforeEvent {
  type: 'Run/asyncFn/before'
  rule: AsyncFnRegister
  target: (...args: any) => any
  resolve: (result: any) => void
  reject: (error: any) => void
  pass: (interceptReturn: boolean) => void
}

interface AsyncFnAfterCommon {
  type: 'Run/asyncFn/after'
  rule: AsyncFnRegister
  target: (...args: any) => any
  resolve: (result: any) => void
  reject: (error: any) => void
  pass: () => void
}

interface AsyncFnSuccessEvent extends AsyncFnAfterCommon {
  result: unknown
}

interface AsyncFnFailureEvent extends AsyncFnAfterCommon {
  error: Error
}

export type AsyncFnAfterEvent = AsyncFnSuccessEvent | AsyncFnFailureEvent

interface SyncFnSuccessEvent {
  type: 'Run/syncFn'
  result: unknown
}

interface SyncFnFailureEvent {
  type: 'Run/syncFn'
  error: Error
}

export type SyncFnEvent = SyncFnSuccessEvent | SyncFnFailureEvent

export type RunEvent =
  | NetworkBeforeEvent
  | NetworkAfterEvent
  | AsyncFnBeforeEvent
  | AsyncFnAfterEvent
  | SyncFnEvent

export type MockEventName = (
  | // Register
  NetWorkRegister
  | AsyncFnRegister
  | SyncFnRegister
  // Run
  | NetworkBeforeEvent
  | NetworkAfterEvent
  | AsyncFnBeforeEvent
  | AsyncFnAfterEvent
  | SyncFnEvent
)['type']
