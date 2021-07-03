import { LOGIN_USER } from './actions'

const userDataAction = (payload) => ({
  type: LOGIN_USER,
  payload
})

export { userDataAction }
