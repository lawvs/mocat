# Mocat

![CI](https://github.com/lawvs/mocat/workflows/CI/badge.svg)

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
  name: 'api',
  url: '/api',
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
