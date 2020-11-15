# Mocat UI

the core UI of Mocat. It's a React based UI which you can initialize with a function. You can configure it by providing a provider API.

## Usage

First you need to install `@mocat/ui` into your app.

```
yarn add @mocat/ui --dev
```

Then you can initialize the UI like this:

```ts
import { EventEmitter2 } from 'eventemitter2'
import { create as createUI } from '@mocat/ui'
import type { UIOptions, MockEventEmitter } from '@mocat/ui'

const roolEl = document.querySelector('#root')
const eventEmitter = new EventEmitter2() as MockEventEmitter

const uiOptions: UIOptions = {
  eventEmitter,
  el: roolEl, // optional
  // ...
}

const ui = createUI(uiOptions)

ui.unmount()
```
