import { combineReducers, Reducer } from 'redux'

import mainState from './main'
// import configState from './config'

const reducer: Reducer<any, any> = combineReducers({
  mainState,
  // configState,
})

export default reducer
