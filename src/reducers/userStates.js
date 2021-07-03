import { LOGIN_USER } from '../actions/actions'
import {} from './actionTypes'

let initialState = {
  user: null
}

const userInfo$Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        user: payload
      }
    default:
      return state
  }
}

export default userInfo$Reducer
