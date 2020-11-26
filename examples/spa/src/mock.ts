import { create, version } from 'mocat'

const app = create({ debug: true })

app.mockRoute({
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

console.log('Mocat version: ', version)
