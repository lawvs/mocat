/**
 * Hack literal union
 *
 * See https://github.com/microsoft/typescript/issues/29729
 * See https://github.com/sindresorhus/type-fest/blob/master/source/literal-union.d.ts
 */
export type LiteralUnion<T extends U, U = string> = T | (U & { _?: never })

export const passSymbol = Symbol('mock_pass')

// Scene

export interface FnScene {
  name?: string
  desc?: string
  pass?: boolean
  return?: unknown
  // implementation?: (...args: any[]) => any
}

export interface NetworkScene {
  name: string
  desc?: string
  status?: number
  headers?: Record<string, string>
  // cookie?: string
  /** Response body */
  response?: unknown
}

// Route

interface CommonRoute {
  name?: string
  desc?: string
}

interface NetWorkRoute extends CommonRoute {
  type: 'Network'
  /** String or RegExp url to match against request urls */
  url: string | RegExp
  method: LiteralUnion<
    'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'HEAD' | 'TRACE' | 'CONNECT'
  >
  scenes: NetworkScene[]
}

export interface AsyncFnRoute extends CommonRoute {
  type: 'AsyncFn'
  target: (...args: any) => Promise<any>
  scenes: FnScene[]
}

export interface SyncFnRoute extends CommonRoute {
  type: 'SyncFn'
  target: (...args: any) => any
  mockFn: {
    mockReset: () => void
    mockReturnValue: (value: any) => void
    mockImplementation: (...args: any) => any
  }
  scenes: FnScene[]
}

type FnRoute = AsyncFnRoute | SyncFnRoute

export type MockRoute = NetWorkRoute | FnRoute
