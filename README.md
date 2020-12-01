# Mocat

![CI](https://github.com/lawvs/mocat/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/mocat)](https://www.npmjs.com/package/mocat)

Mocat is a development toolbar for mock. It allows you interactively develop and test network request. This library is inspired by [cypress](https://github.com/cypress-io/cypress).

![demo](https://user-images.githubusercontent.com/18554747/100751183-5ab4c800-342a-11eb-9172-5df6d1198f06.gif)

## Installation

To install and save in your package.json dev dependencies, run:

```sh
# with npm
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
  // Describe the name of API
  name: 'api',
  // Describe the API (optional)
  // desc: '',
  // Specify the URL to match
  url: '/api',
  // Specify the HTTP method to match on (optional)
  // method: 'GET',
  // Create scenarios
  scenes: [
    {
      name: 'Alice',
      response: {
        username: 'Alice',
        msg: 'fake data',
      },
    },
    {
      // Scenario name
      name: 'Bob',
      // Scenario description
      desc: 'the bob',
      // The HTTP status code to send.
      status: 200,
      // HTTP headers to accompany the response.
      headers: { 'Content-Type': 'application/json' },
      /**
       * Reply to the request with a body.
       */
      response: {
        username: 'Bob',
        msg: 'fake data',
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

## Other similar projects

- [Mock](https://github.com/nuysoft/Mock)
- [data-mocks](https://github.com/ovotech/data-mocks)
- [xhr-mock](https://github.com/jameslnewell/xhr-mock)
- [fetch-mock](https://github.com/wheresrhys/fetch-mock)
- [cypress](https://github.com/cypress-io/cypress)
- [nise](https://github.com/sinonjs/nise)

## License

[MIT](LICENCE)
