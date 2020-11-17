# Mocat

![CI](https://github.com/lawvs/mocat/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/mocat)](https://www.npmjs.com/package/mocat)

Mocat is a development toolbar for mock. It allows you interactively develop and test network request. This library is inspired by [cypress](https://github.com/cypress-io/cypress).

![demo](https://user-images.githubusercontent.com/18554747/98848902-bd531d80-2495-11eb-8ce9-bbb29eea46d7.gif)

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
import { create, mockRoute } from 'mocat'

mockRoute({
  // Describe the name of API
  name: 'api',
  // Describe the API (optional)
  // desc: '',
  // Specify the URL to match
  url: '/api',
  // Specify the HTTP method to match on (optional)
  // method: 'GET',
  // Create scene
  scenes: [
    {
      name: 'Alice',
      response: {
        username: 'Alice',
        msg: 'fake data',
      },
    },
    {
      name: 'Bob',
      response: {
        username: 'Bob',
        msg: 'fake data',
      },
    },
  ],
})

create()
```

## References

- [Mock](https://github.com/nuysoft/Mock)
- [data-mocks](https://github.com/ovotech/data-mocks)
- [xhr-mock](https://github.com/jameslnewell/xhr-mock)
- [fetch-mock](https://github.com/wheresrhys/fetch-mock)
- [cypress](https://github.com/cypress-io/cypress)
- [nise](https://github.com/sinonjs/nise)

## License

[MIT](LICENCE)
