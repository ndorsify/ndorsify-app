import { combineReducers } from 'redux'
import userInfo$Reducer from './userStates'

export default combineReducers({
  userData: userInfo$Reducer
})
