import { all, takeLatest, call, put } from "redux-saga/effects";
import * as API from '../api';
import * as actions from '../redux/actions';
import * as actionTypes from '../redux/actions/actionTypes';

function* addWorkspace({ workspaceHost }) {
    yield put(actions.setWorkspaceInfoStatus('FETCHING'));

    const response = yield call(API.getWorkspaceInfo, workspaceHost);

    if (response.err) {
        // yield put(AssessmentPlayerActions.setResetRequestStatus(RequestStatus.ERROR))
        console.error('!!! ERROR !!!')
    } else {
        yield all([
            put(actions.setWorkspaceInfo(workspaceHost, response.data)),
            put(actions.setWorkspaceInfoStatus('INITIAL'))
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

export default function* rootSaga() {
    yield all([
        takeLatest(actionTypes.ADD_WORKSPACE, addWorkspace),
        takeLatest(actionTypes.GET_AVAILABLE_ROOMS, getAvailableRooms),
    ])
}