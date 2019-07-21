import Rabbit from '../'

const xhrRequest = (method: string, url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.responseText)
      }
    }
    xhr.onerror = e => reject(e)
    xhr.open(method, url)
    xhr.send()
  })

describe('rabbit Mock run normal', () => {
  const rabbit = new Rabbit()
  const MOCK_DATA = 'Hello Rabbit Mock!' // mock data
  const handleRequest = ({ detail }: any) => {
    detail.resolve(MOCK_DATA)
  }

  beforeEach(() => {
    window.addEventListener('rabbit.request', handleRequest)
    rabbit.setup()
  })

  afterEach(() => {
    rabbit.teardown()
    window.removeEventListener('rabbit.request', handleRequest)
  })

  it('can mock xhr correctly', async () => {
    const data = await xhrRequest('GET', '')
    expect(data).toBe(MOCK_DATA)
  })

  it('can mock fetch correctly', async () => {
    const resp = await fetch('')
    const data = await resp.text()

    expect(resp.status).toEqual(200)
    expect(data).toBe(MOCK_DATA)
  })
})
