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

export const getAvailableRooms = (workspaceHost, date) => ({
    type: actionTypes.GET_AVAILABLE_ROOMS,
    workspaceHost,
    date
});

export const setAvailableRooms = (workspaceHost, date, availableRooms) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS,
    workspaceHost,
    date,
    availableRooms
});

export const setAvailableRoomsStatus = (workspaceHost, availableRoomsStatus) => ({
    type: actionTypes.SET_AVAILABLE_ROOMS_STATUS,
    workspaceHost,
    availableRoomsStatus
});

export const filterRoomsByName = (workspaceHost, searchedRoomName) => ({
    type: actionTypes.FILTER_ROOMS_BY_NAME,
    workspaceHost,
    searchedRoomName
});

export const filterRoomsByNextHourAvailability = (workspaceHost, nextHourAvailability) => ({
    type: actionTypes.FILTER_ROOMS_BY_NEXT_HOUR_AVAILABILITY,
    workspaceHost,
    nextHourAvailability
});