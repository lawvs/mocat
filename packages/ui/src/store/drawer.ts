import { useCallback } from 'react'
import { useDispatch, useStore } from './store'
import type { State } from './store'

type DrawerState = State['drawer']

const useUpdateDrawer = () => {
  const dispatch = useDispatch()
  return (payload: Partial<DrawerState>) =>
    dispatch({
      type: 'DRAWER/UPDATE',
      payload,
    })
}

export const useDrawer = () => {
  const {
    drawer: { pin, open },
  } = useStore()
  const updateState = useUpdateDrawer()
  const setOpen = useCallback(
    (newState = true) => {
      // TODO other solution
      // wait click away
      setTimeout(() => updateState({ open: newState }), 0)
    },
    [updateState],
  )

  const setPin = useCallback(
    (newState: boolean) => updateState({ pin: newState }),
    [updateState],
  )

  const togglePin = () => setPin(!pin)
  const whenClickAway = useCallback(() => {
    if (pin) {
      return
    }
    updateState({ open: false })
  }, [updateState, pin])

  return {
    open,
    pin,
    setOpen,
    // setPin,
    // toggleDrawer: () => setOpen(!open),
    togglePin,
    whenClickAway,
  }
}
