import { all, takeLatest, call, put, select } from "redux-saga/effects";
import * as API from '../api';
import * as actions from '../redux/actions';
import * as actionTypes from '../redux/actions/actionTypes';

function* addWorkspace() {
    const workspaceHost = yield select(({ newWorkspace }) => newWorkspace.hostname);

    yield put(actions.setWorkspaceStatus('FETCHING'));

    const response = yield call(API.getWorkspaceInfo, workspaceHost);
    if (response.err) {
        yield put(actions.setWorkspaceStatus('ERROR'));
    } else {
        yield all([
            put(actions.setWorkspaceInfo(workspaceHost, response.data)),
            put(actions.setWorkspaceStatus('LOADED')),
            put(actions.setWorkspaceStatus('INITIAL'))
        ])
    }
}

function* getAvailableRooms({ workspaceHost, date = Date.now() }) {
    yield put(actions.setAvailableRoomsStatus(workspaceHost, 'FETCHING'));

    const response = yield call(API.getRooms, workspaceHost, date)

    if (response.err) {
        // yield put(AssessmentPlayerActions.setResetRequestStatus(RequestStatus.ERROR))
        console.error('!!! ERROR !!!')
    } else {
        yield put(actions.setAvailableRooms(workspaceHost, date, response.data))
    }
}

function* makeBooking({ workspaceHost }) {
    yield put(actions.validateBookingTime());

    const { timeValidation, currentBooking } = yield select(({ bookings }) => bookings);

    if (timeValidation.isValid) {
        const { date, time_start, time_end, title, description, room, passes } = currentBooking
        const response = yield call(API.bookRoom, workspaceHost, {
            booking: {
                date,
                time_start: time_start.valueOf(),
                time_end: time_end.valueOf(),
                title,
                description,
                room
            },
            passes
        });
        console.log(response)
    }
}

export default function* rootSaga() {
    yield all([
        takeLatest(actionTypes.ADD_WORKSPACE, addWorkspace),
        takeLatest(actionTypes.GET_AVAILABLE_ROOMS, getAvailableRooms),
        takeLatest(actionTypes.MAKE_BOOKING, makeBooking),
    ])
}