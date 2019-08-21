import { combineReducers } from 'redux';
import workspacesReducer from './workspacesReducer';
import bookingsReducer from './bookingsReducer';
import * as actionTypes from '../actions/actionTypes';

const INITIAL_STATE = {
    hostname: 'acorp.dac.eu',
    status: 'INITIAL'
};

const updateWorkspaceHostname = (state, { hostname }) => ({ ...state, hostname });

const setWorkspaceStatus = (state, { status }) => ({ ...state, status });

const newWorkspaceReducer = (state = INITIAL_STATE, action) => {
    const handlers = {
        [actionTypes.UPDATE_WORKSPACE_HOSTNAME]: updateWorkspaceHostname,
        [actionTypes.SET_WORKSPACE_STATUS]: setWorkspaceStatus
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default combineReducers({
    newWorkspace: newWorkspaceReducer,
    workspaces: workspacesReducer,
    bookings: bookingsReducer
});