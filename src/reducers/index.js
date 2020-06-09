// reducers/index.js
import { ADD, SUB,LANG,SERVER_CODE } from '../actions'
import { combineReducers } from 'redux'
import auth from './auth'
const initState = {
    number: 0, lang:"..",server_code:0
};

const data = (state = initState, action) => {
    console.log(state.lang)
    switch (action.type) {
        case ADD:
            return Object.assign({}, state, {
                number: state.number + 1
            });
        case SUB:
            return Object.assign({}, state, {
                number: state.number - 1
            });
        case LANG:
            initState.lang = action.e
            return Object.assign({}, state, {
                lang: action.e
            });
        case SERVER_CODE:
            initState.server_code = action.server_code
            console.log(action)
            return Object.assign({}, state, {
                server_code: action.server_code
            });
        default:
            return state;
    }
};

const App = combineReducers({
    data,auth
});

export default App;