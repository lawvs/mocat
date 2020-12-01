import { create, version } from 'mocat'

const app = create({ debug: true })

app.mockRoute({
  name: 'api',
  url: '/api',
  scenarios: [
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
