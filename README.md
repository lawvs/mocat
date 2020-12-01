# Mocat

![CI](https://github.com/lawvs/mocat/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/mocat)](https://www.npmjs.com/package/mocat)

Mocat is a development toolbar for mocking. It allows you to interactively develop and test network requests. This library is inspired by [cypress](https://github.com/cypress-io/cypress).

![demo](https://user-images.githubusercontent.com/18554747/100751183-5ab4c800-342a-11eb-9172-5df6d1198f06.gif)

## Installation

To install and save in your package.json dev dependencies, run:

```sh
# With npm
npm install --save-dev mocat

# Or with Yarn
yarn add --dev mocat
```

## Usage

```ts
// mock.ts
import { create } from 'mocat'

const app = create()

app.mockRoute({
  name: 'login api',
  // Specify the URL to match
  url: '/api/login',
  // Create scenarios
  scenarios: [
    {
      name: 'login success',
      response: {
        username: 'Alice',
        msg: 'ok',
      },
    },
    {
      name: 'login fail',
      desc: 'username or password incorrect',
      // The HTTP status code to send.
      status: 400,
      // HTTP headers to accompany the response.
      headers: { 'Content-Type': 'application/json' },
      // Serve a static string/JSON object as the response body.
      response: {
        msg: 'username or password incorrect',
      },
    },
  ],
})
```

Then load it from the application entry:

```ts
// main.ts
import { App } from './App'

// Load React
ReactDOM.render(<App />, document.getElementById('app'))
// Or Vue
createApp(App).mount('#app')

if (process.env.NODE_ENV !== 'production') {
  await import('./mock')
}
```

## API

### MockRoute

```ts
export interface MockRoute {
  /**
   * The name of API.
   */
  name?: string
  desc?: string
  /**
   * Match against the full request URL.
   * If a string is passed, it will be used as a substring match,
   * not an equality match.
   */
  url: string | RegExp | ((url: string) => boolean)
  /**
   * Match against the request's HTTP method.
   * All methods are matched by default.
   */
  method?:
    | 'GET'
    | 'POST'
    | 'OPTIONS'
    | 'PUT'
    | 'DELETE'
    | 'HEAD'
    | 'TRACE'
    | 'CONNECT'
  scenarios?: NetworkScenario[]
}
```

### NetworkScenario

```ts
export interface NetworkScenario {
  /**
   * The name of scenario.
   */
  name: string
  /**
   * The description of scenario.
   */
  desc?: string
  /**
   * The HTTP status code to send.
   * @default 200
   */
  status?: number
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: Record<string, string>
  /**
   * Serve a static string/JSON object as the response body.
   */
  response?: ConstructorParameters<typeof Response>[0] | Record<string, any>
  error?: any
}
```

## Other similar projects

- [Mock](https://github.com/nuysoft/Mock)
- [data-mocks](https://github.com/ovotech/data-mocks)
- [xhr-mock](https://github.com/jameslnewell/xhr-mock)
- [fetch-mock](https://github.com/wheresrhys/fetch-mock)
- [cypress](https://github.com/cypress-io/cypress)
- [nise](https://github.com/sinonjs/nise)

## License

[MIT](LICENSE)
