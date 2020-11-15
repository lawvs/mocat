# Mocat Interceptor

## Intro

The part of Mocat which is used to interceptor http request.

## Usage

Install dependencies:

```sh
yarn add --dev @mocat/interceptor
```

Then

```ts
import { eventEmitter, setupFetch, setupXHR } from '@mocat/interceptor'

// proxy http request
const resetFetch = setupFetch()
const resetXHR = setupXHR()

eventEmitter.onAny((event, value) => console.log(event, value))

// reset
resetFetch()
resetXHR()
```

## Credits

The implementation of this module is power by the following prior art in the JavaScript ecosystem:

- [xhr-mock](https://github.com/jameslnewell/xhr-mock)
- [fetch-mock](https://github.com/wheresrhys/fetch-mock)

## Caveats

- `@mocat/interceptor` will replaces `window.fetch` and `window.XMLHttpRequest` with a proxy that Mocat can spy on and stub.
