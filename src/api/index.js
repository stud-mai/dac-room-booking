import axios from 'axios';

export const API = url => axios.create({ baseURL: `https://${url.trim()}/roombooking` });

export const getWorkspaceInfo = (workspaceHost) =>
    API(workspaceHost).get('/workspace')
        .then(response => response)
        .catch(err => ({ err }))

export const getRooms = (workspaceHost, date) =>
    API(workspaceHost).post(`/getrooms`, { date })
        .then(response => response)
        .catch(err => ({ err }))

// export const submitQuestionManualGrade = ({ serviceUrl, question, value, comment }) =>
//     API(serviceUrl).post(`/questions/${question.id}/grade`, { question, value, comment })
//         .then(response => response)
//         .catch(err => ({ err }))