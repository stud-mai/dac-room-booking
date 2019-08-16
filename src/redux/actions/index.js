import * as actionTypes from './actionTypes';

export const addWorkspace = (workspaceHost) => ({
    type: actionTypes.ADD_WORKSPACE,
    workspaceHost
});

export const setWorkspaceInfo = (workspaceHost, workspaceInfo) => ({
    type: actionTypes.SET_WORKSPACE_INFO,
    workspaceHost,
    workspaceInfo
});

export const setWorkspaceInfoStatus = (workspaceInfoStatus) => ({
    type: actionTypes.SET_WORKSPACE_INFO_STATUS,
    workspaceInfoStatus
});

export const getAvailableRooms = (workspaceHost) => ({
    type: actionTypes.GET_AVAILABLE_ROOMS,
    workspaceHost
});

export const setAvailableRooms = (workspaceHost, availableRooms) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS,
    workspaceHost,
    availableRooms
});

export const setAvailableRoomsStatus = (workspaceHost, availableRoomsStatus) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS_STATUS,
    workspaceHost,
    availableRoomsStatus
});