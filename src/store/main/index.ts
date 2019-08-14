import { RabbitRequest, RabbitResponse } from '../../core'

/**
 * Actions
 */
const ADD_REQUEST = 'ADD_REQUEST'
const ADD_RESPONSE = 'ADD_RESPONSE'

type ActionTypes = { type: string; payload: any }

// main state
export interface MainState {
  readonly reqQueue: RabbitRequest[]
  readonly respQueue: RabbitResponse[]
}

const initState: MainState = {
  reqQueue: [],
  respQueue: [],
}

/**
 * Reducer
 */
export default (state = initState, action: ActionTypes): MainState => {
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

/**
 * Action Creators
 */

export const addRequest = (request: RabbitRequest): ActionTypes => ({
  type: ADD_REQUEST,
  payload: {
    request,
  },
})

export const addResponse = (response: RabbitResponse): ActionTypes => ({
  type: ADD_REQUEST,
  payload: {
    response,
  },
})
