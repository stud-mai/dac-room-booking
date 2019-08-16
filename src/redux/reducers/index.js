import * as actionTypes from '../actions/actionTypes';

const INITIAL_STATE = {
    newWorkspaceHostName: '',
    workspaceInfoStatus: 'INITIAL',
    workspaces: {}
};

const setWorkspaceInfo = (state, { workspaceHost, workspaceInfo }) => ({
    ...state,
    newWorkspaceHostName: workspaceHost,
    workspaceInfoStatus: 'LOADED',
    workspaces: {
        ...state.workspaces,
        [workspaceHost]: {
            ...workspaceInfo,
            availableRoomsStatus: 'INITIAL'
        }
    }
});

const setWorkspaceInfoStatus = (state, { workspaceInfoStatus }) => ({ ...state, workspaceInfoStatus });

const setAvailableRooms = (state, { workspaceHost, availableRooms }) => ({
    ...state,
    workspaces: {
        ...state.workspaces,
        [workspaceHost]: {
            ...state.workspaces[workspaceHost],
            availableRoomsStatus: 'LOADED',
            availableRooms
        }
    }
});

const setAvailableRoomsStatus = (state, { workspaceHost, availableRoomsStatus }) => ({
    ...state,
    workspaces: {
        ...state.workspaces,
        [workspaceHost]: {
            ...state.workspaces[workspaceHost],
            availableRoomsStatus
        }
    }
});


const roomBookingReducer = (state = INITIAL_STATE, action) => {
    const handlers = {
        [actionTypes.SET_WORKSPACE_INFO]: setWorkspaceInfo,
        [actionTypes.SET_WORKSPACE_INFO_STATUS]: setWorkspaceInfoStatus,
        [actionTypes.SET_AVAILABLE_ROOMS]: setAvailableRooms,
        [actionTypes.SET_AVAILABLE_ROOMS_STATUS]: setAvailableRoomsStatus,
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default roomBookingReducer;