import { create, mockRoute } from 'mocat'

create({ debug: true })

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
