import { createApp } from 'vue'
import { App } from './App'

createApp(App).mount('#app')

if (process.env.NODE_ENV !== 'production') {
  import('./mock')
}
