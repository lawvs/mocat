/**
 * Create a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.
 * Workaround for [Microsoft/TypeScript#29729](https://github.com/microsoft/typescript/issues/29729).
 *
 * See https://github.com/sindresorhus/type-fest/blob/master/source/literal-union.d.ts
 */
export type LiteralUnion<T extends U, U = string> = T | (U & { _?: never })

// Scene

export interface FnScene {
  name: string
  desc?: string
  pass?: boolean
  return?: any
  error?: any
  // implementation?: (...args: any[]) => any
}

export interface NetworkScene {
  name: string
  desc?: string
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

export type Scene = NetworkScene | FnScene

//#region Register Event

interface Comment {
  name?: string
  desc?: string
}

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

export type RegisterEvent = NetWorkRegister | FnRegister
//#endregion

//#region Run Event

export interface NetworkBeforeEvent {
  type: 'Run/network/before'
  requestType: 'xhr' | 'fetch'
  rule: NetWorkRegister
  request: Request
  resolve: (result: NetworkScene) => void
  reject: (error?: any) => void
  pass: (interceptReturn?: boolean) => void
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
  reject: (error?: any) => void
  pass: (interceptReturn?: boolean) => void
}

interface AsyncFnAfterCommon {
  type: 'Run/asyncFn/after'
  rule: AsyncFnRegister
  target: (...args: any) => any
  resolve: (result: any) => void
  reject: (error?: any) => void
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

//#endregion

export type MockEvent = RegisterEvent | RunEvent

// https://stackoverflow.com/questions/50125893/typescript-derive-map-from-discriminated-union
type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<
  K,
  V
>
  ? T
  : never

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>
}
export type MockEventMap = MapDiscriminatedUnion<MockEvent, 'type'>
