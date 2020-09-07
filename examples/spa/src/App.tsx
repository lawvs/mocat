/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
import { defineComponent, ref, computed } from 'vue'

export const App = defineComponent({
  setup() {
    const btnText = ref('Fetch')
    const data = ref()
    const dataStr = computed(() => JSON.stringify(data.value))

    const getUser = async () => {
      if (btnText.value === 'Loading...') {
        return
      }
      data.value = undefined
      btnText.value = 'Loading...'
      try {
        data.value = await (await fetch('/api/user.json')).json()
        btnText.value = 'Done!'
      } catch (error) {
        data.value = error?.stack
        btnText.value = 'Error!'
        throw error
      }
    }

    return () => (
      <>
        <h1>Rabbit</h1>
        <div className="card">
          <button onClick={getUser}>{btnText.value}</button>
          {/* @ts-ignore */}
          <textarea value={dataStr.value}></textarea>
        </div>
      </>
    )
  },
})
