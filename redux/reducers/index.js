import {combineReducers} from 'redux'
import {user} from './user'
import {users} from './users'

const Reducers = combineReducers({
    useState: user,
    usersState: users
})

export default Reducers