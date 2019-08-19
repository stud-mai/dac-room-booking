import dayjs from 'dayjs';
import { compose } from '../../utils';
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

const setAvailableRooms = (state, { workspaceHost, date, availableRooms }) => ({
    ...state,
    workspaces: {
        ...state.workspaces,
        [workspaceHost]: {
            ...state.workspaces[workspaceHost],
            availableRoomsForDate: new Date(date),
            availableRoomsStatus: 'LOADED',
            availableRooms,
            filteredRooms: availableRooms,
            searchedRoomName: '',
            nextHourAvailability: false
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

const applyFilters = ({ availableRooms, searchedRoomName, nextHourAvailability}, options) => {
    const filterByName = (roomName = searchedRoomName) => (rooms) => {
        const lowerCaseRoomName = roomName.trim().toLowerCase();
        if (lowerCaseRoomName !== "") {
            return rooms.filter(({ name }) => {
                return name.toLowerCase().includes(lowerCaseRoomName)
            })
        }
        return rooms;
    };
    const filterByNextHour = (nextHour = nextHourAvailability) => (rooms) => {
        if (nextHour) {
            const currentTime = dayjs(Date.now());
            const nextHourTime = currentTime.add(1, 'hour');
            return rooms.filter(room => {
                return room.avail.some(timePeriod => {
                    const [availStarts, availEnds] = timePeriod.split(' - ').map(time => time.split(':').map(Number));
                    const startTime = currentTime.hour(availStarts[0]).minute(availStarts[1]);
                    const endTime = currentTime.hour(availEnds[0]).minute(availEnds[1]);
                    return currentTime.isAfter(startTime) && nextHourTime.isBefore(endTime);
                });
            })
        }
        return rooms;
    };

    return compose(
        filterByNextHour(options.nextHourAvailability),
        filterByName(options.searchedRoomName)
    )(availableRooms);
}

const filterRoomsByName = (state, { workspaceHost, searchedRoomName }) => {
    const filteredRooms = applyFilters(state.workspaces[workspaceHost], { searchedRoomName });

    return {
        ...state,
        workspaces: {
            ...state.workspaces,
            [workspaceHost]: {
                ...state.workspaces[workspaceHost],
                searchedRoomName,
                filteredRooms
            }
        }
    }
}

const filterRoomsByNextHourAvailability = (state, { workspaceHost, nextHourAvailability }) => {
    const filteredRooms = applyFilters(state.workspaces[workspaceHost], { nextHourAvailability });

    return {
        ...state,
        workspaces: {
            ...state.workspaces,
            [workspaceHost]: {
                ...state.workspaces[workspaceHost],
                nextHourAvailability,
                filteredRooms
            }
        }
    }
}

const roomBookingReducer = (state = INITIAL_STATE, action) => {
    const handlers = {
        [actionTypes.SET_WORKSPACE_INFO]: setWorkspaceInfo,
        [actionTypes.SET_WORKSPACE_INFO_STATUS]: setWorkspaceInfoStatus,
        [actionTypes.SET_AVAILABLE_ROOMS]: setAvailableRooms,
        [actionTypes.SET_AVAILABLE_ROOMS_STATUS]: setAvailableRoomsStatus,
        [actionTypes.FILTER_ROOMS_BY_NAME]: filterRoomsByName,
        [actionTypes.FILTER_ROOMS_BY_NEXT_HOUR_AVAILABILITY]: filterRoomsByNextHourAvailability,
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default roomBookingReducer;