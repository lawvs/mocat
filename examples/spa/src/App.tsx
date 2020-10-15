import { defineComponent, ref, computed } from 'vue'
import axios from 'axios'

const FetchCard = defineComponent({
  setup() {
    const btnText = ref('Fetch')
    const data = ref()
    const dataStr = computed(() => JSON.stringify(data.value))
    const getData = async () => {
      data.value = undefined
      btnText.value = 'Fetch Loading...'
      try {
        data.value = await (await fetch('/api/data.json')).json()
        btnText.value = 'Fetch Done!'
      } catch (error) {
        data.value = error?.stack
        btnText.value = 'Fetch Error!'
        throw error
      }
    }

    return () => (
      <div class="card">
        <button onClick={getData}>{btnText.value}</button>
        <textarea value={dataStr.value}></textarea>
      </div>
    )
  },
})

const AxiosCard = defineComponent({
  setup() {
    const btnText = ref('Axios Get')
    const data = ref()
    const dataStr = computed(() => JSON.stringify(data.value))
    const getData = async () => {
      data.value = undefined
      btnText.value = 'Axios Loading...'
      try {
        data.value = (await axios.get('/api/data.json')).data
        btnText.value = 'Axios Done!'
      } catch (error) {
        data.value = error?.stack
        btnText.value = 'Axios Error!'
        throw error
      }
    }

    return () => (
      <div class="card">
        <button onClick={getData}>{btnText.value}</button>
        <textarea value={dataStr.value}></textarea>
      </div>
    )
  },
})

export const App = defineComponent({
  setup() {
    return () => (
      <>
        <h1>Rabbit</h1>
        <FetchCard />
        <AxiosCard />
      </>
    )
  },
})
