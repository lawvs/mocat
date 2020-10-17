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
  response?: ConstructorParameters<typeof Response>[0] | Record<string, any>
  error?: any
}

export type Scene = NetworkScene | FnScene

interface Event {
  readonly timeStamp: number
}

//#region Register Event

interface Comment {
  name?: string
  desc?: string
}

export interface NetWorkRegister extends Comment, Event {
  type: 'Register/networkRoute'
  /** String or RegExp url to match against request urls */
  url: string | RegExp | ((url: string) => boolean)
  method?: LiteralUnion<
    'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'HEAD' | 'TRACE' | 'CONNECT'
  >
  scenes?: NetworkScene[]
}

export interface AsyncFnRegister extends Comment, Event {
  type: 'Register/asyncFn'
  target: (...args: any) => Promise<any>
  scenes?: FnScene[]
}

export interface SyncFnRegister extends Comment, Event {
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

interface NetworkEventBase extends Event {
  readonly requestType: 'xhr' | 'fetch'
  /**
   * matched route rule
   */
  readonly rule: NetWorkRegister
  readonly request: Request
  // TODO rename to resolveScene?
  readonly resolve: (result: NetworkScene) => void
  /**
   * mock offline network
   */
  readonly reject: (error?: any) => void
}

export interface NetworkBeforeEvent extends NetworkEventBase {
  readonly type: 'Run/network/before'
  readonly pass: (interceptReturn?: boolean) => void
}

interface NetworkAfterBase extends NetworkEventBase {
  readonly type: 'Run/network/after'
  readonly pass: () => void
}
interface NetworkSuccessEvent extends NetworkAfterBase {
  readonly response: Response
}
interface NetworkFailureEvent extends NetworkAfterBase {
  readonly error: unknown
}

export type NetworkAfterEvent = NetworkSuccessEvent | NetworkFailureEvent

interface AsyncFnBase extends Event {
  rule: AsyncFnRegister
  target: (...args: any) => any
  resolve: (result: any) => void
  reject: (error?: any) => void
}

export interface AsyncFnBeforeEvent extends AsyncFnBase {
  type: 'Run/asyncFn/before'
  pass: (interceptReturn?: boolean) => void
}

interface AsyncFnAfterBase extends AsyncFnBase {
  type: 'Run/asyncFn/after'
  pass: () => void
}

interface AsyncFnSuccessEvent extends AsyncFnAfterBase {
  result: unknown
}

interface AsyncFnFailureEvent extends AsyncFnAfterBase {
  error: Error
}

export type AsyncFnAfterEvent = AsyncFnSuccessEvent | AsyncFnFailureEvent

interface SyncFnSuccessEvent extends Event {
  type: 'Run/syncFn'
  result: unknown
}

interface SyncFnFailureEvent extends Event {
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
