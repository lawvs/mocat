import { RabbitRequest, RabbitResponse } from '../../core'

// main state
export interface MainState {
  readonly reqQueue: RabbitRequest[]
  readonly respQueue: RabbitResponse[]
}

const initState: MainState = {
  reqQueue: [],
  respQueue: [],
}

const ADD_REQUEST = 'ADD_REQUEST'
const ADD_RESPONSE = 'ADD_RESPONSE'

export default (state = initState, action: any): MainState => {
  switch (action.type) {
    case ADD_REQUEST: {
      const {
        payload: { request: req },
      } = action
      return {
        ...state,
        reqQueue: [...state.reqQueue, req],
      }
    }
    case ADD_RESPONSE: {
      const {
        payload: { response: resp },
      } = action
      return {
        ...state,
        reqQueue: [...state.respQueue, resp],
      }
    }
  }
  return state
}
