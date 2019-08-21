import React, { useState } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { TimePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ParticipantDialog from '../components/ParticipantDialog';
import ParticipantsList from '../components/ParticipantsList';
import * as actions from '../redux/actions';

dayjs.extend(advancedFormat);

const BookingDialog = (props) => {
    const {
        open, room, date, title, description, time_start, time_end, passes, closeDialog, updateEventField,
        timeValidation: { isValid, errorMsg }, addParticipant, removeParticipant, makeBooking
    } = props;

    const [openParticipantDialog, setOpenParticipantDialog] = useState(false);
    const smallViewPort = useMediaQuery('(max-width: 766px)');
    const isFormFilledUp = title !== '' && description !== '' && passes.length;

    const eventFieldChangeHandler = ({ target }) => updateEventField(target.name, target.value);
    const toggleParticipantDialog = () => setOpenParticipantDialog(!openParticipantDialog);

    return (
        <Dialog
            open={open}
            onClose={closeDialog}
            fullScreen={smallViewPort}
            transitionDuration={{ enter: 300, exit: 10 }}
            aria-labelledby={`booking-room-${room}`}
        >
            <DialogTitle id={`booking-room-${room}`}>Booking Room {room}</DialogTitle>
            <DialogContent>
                <Typography>
                    To book the room for {dayjs(date).format('MMMM, Do YYYY')} fill up following fields:
                </Typography>
                <Typography variant="caption" gutterBottom>
                    (all fields are required)
                </Typography>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    margin="dense"
                    label="Event title"
                    name="title"
                    value={title}
                    onChange={eventFieldChangeHandler}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Event desciption"
                    name="description"
                    value={description}
                    onChange={eventFieldChangeHandler}
                />
                <TimePicker
                    fullWidth
                    required
                    ampm={false}
                    minutesStep={15}
                    margin="dense"
                    label="From"
                    value={time_start}
                    onChange={(time) => updateEventField('time_start', time)}
                    error={!isValid}
                />
                <TimePicker
                    fullWidth
                    required
                    ampm={false}
                    minutesStep={15}
                    margin="dense"
                    label="To"
                    value={time_end}
                    onChange={(time) => updateEventField('time_end', time)}
                    error={!isValid}
                />
                {!isValid &&
                    <Typography variant="body2" color="error" gutterBottom>
                        {errorMsg}
                    </Typography>
                }
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={toggleParticipantDialog}
                >
                    Add Participant
                </Button>
                <ParticipantDialog
                    open={openParticipantDialog}
                    closeDialog={toggleParticipantDialog}
                    addParticipant={addParticipant}
                />
                <ParticipantsList
                    participants={passes}
                    removeParticipant={removeParticipant}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={makeBooking} color="primary" disabled={!isFormFilledUp || !isValid}>
                    Book
                </Button>
            </DialogActions>
        </Dialog>
    )
};

const mapStateToProps = ({ bookings }) => ({
    ...bookings.currentBooking,
    timeValidation: bookings.timeValidation
});

const mapDispatchToProps = (dispatch, { workspaceHost }) => ({
    updateEventField: (field, value) => dispatch(actions.updateEventField(field, value)),
    addParticipant: (participant) => dispatch(actions.addParticipant(participant)),
    removeParticipant: (index) => dispatch(actions.removeParticipant(index)),
    makeBooking: () => dispatch(actions.makeBooking(workspaceHost))
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingDialog);
