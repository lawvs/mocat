import { create, registerNetworkRoute } from 'rabbit-mock'

create({ debug: true }).mount()

registerNetworkRoute({
  name: 'api',
  url: '/api',
  scenes: [
    {
      name: 'Alice',
      response: {
        username: 'Alice',
      },
    },
    {
      name: 'Bob',
      response: {
        username: 'Bob',
      },
    },
  ],
})
