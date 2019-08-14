import { combineReducers, Reducer } from 'redux'

import mainState from './main'
import { type } from 'os'
// import configState from './config'

type GlobalState = any
type GlobalActionTypes = any

const reducer: Reducer<GlobalState, GlobalActionTypes> = combineReducers({
  mainState,
  // configState,
})

export default reducer
