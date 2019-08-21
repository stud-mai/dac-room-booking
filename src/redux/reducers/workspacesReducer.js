
import dayjs from 'dayjs';
import { getStartAndEndTimeFromPeriod, compose } from '../../utils';
import * as actionTypes from '../actions/actionTypes';

const setWorkspaceInfo = (state, { workspaceHost, workspaceInfo }) => ({
    ...state,
    [workspaceHost]: {
        ...workspaceInfo,
        availableRoomsStatus: 'INITIAL'
    }
});

const setAvailableRooms = (state, { workspaceHost, date, availableRooms }) => ({
    ...state,
    [workspaceHost]: {
        ...state[workspaceHost],
        dateForAvailableRooms: new Date(date),
        availableRoomsStatus: 'LOADED',
        availableRooms,
        filteredRooms: availableRooms,
        searchedRoomName: '',
        nextHourAvailability: false
    }
});

const setAvailableRoomsStatus = (state, { workspaceHost, availableRoomsStatus }) => ({
    ...state,
    [workspaceHost]: {
        ...state[workspaceHost],
        availableRoomsStatus
    }
});

const applyFilters = ({ availableRooms, searchedRoomName, nextHourAvailability }, options) => {
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
            const currentTime = dayjs();
            const nextHourTime = currentTime.add(1, 'hour');
            return rooms.filter(room => {
                return room.avail.some(timePeriod => {
                    const { startTime, endTime } = getStartAndEndTimeFromPeriod(timePeriod, currentTime);
                    return currentTime >= startTime && nextHourTime <= endTime;
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
    const filteredRooms = applyFilters(state[workspaceHost], { searchedRoomName });
    return {
        ...state,
        [workspaceHost]: {
            ...state[workspaceHost],
            searchedRoomName,
            filteredRooms
        }
    }
};

const filterRoomsByNextHourAvailability = (state, { workspaceHost, nextHourAvailability }) => {
    const filteredRooms = applyFilters(state[workspaceHost], { nextHourAvailability });
    return {
        ...state,
        [workspaceHost]: {
            ...state[workspaceHost],
            nextHourAvailability,
            filteredRooms
        }
    }
}

const workspacesReducer = (state = {}, action) => {
    const handlers = {
        [actionTypes.SET_WORKSPACE_INFO]: setWorkspaceInfo,
        [actionTypes.SET_AVAILABLE_ROOMS]: setAvailableRooms,
        [actionTypes.SET_AVAILABLE_ROOMS_STATUS]: setAvailableRoomsStatus,
        [actionTypes.FILTER_ROOMS_BY_NAME]: filterRoomsByName,
        [actionTypes.FILTER_ROOMS_BY_NEXT_HOUR_AVAILABILITY]: filterRoomsByNextHourAvailability,
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
};

export default workspacesReducer;