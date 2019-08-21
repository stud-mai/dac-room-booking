import React, { useReducer } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import validate, {
    notEmpty,
    isEmail,
    isPhone,
    VALID
} from '../utils/validation';

const initialState = {
    name: { value: '', ...VALID },
    email: { value: '', ...VALID },
    number: { value: '', ...VALID }
};

const fieldValidators = {
    name: notEmpty('Participant name cannot be empty'),
    email: [notEmpty('Email address cannot be empty'), isEmail('Email address is not correct')],
    number: [notEmpty('Phone number cannot be empty'), isPhone('Phone number is not correct')],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'update': {
            const { field, value } = action;
            return {
                ...state,
                [field]: { ...state[field], value }
            };
        };
        case 'validate': {
            const { field } = action;
            const { value } = state[field];
            const validation = validate(fieldValidators[field])(value);
            return {
                ...state,
                [field]: { ...validation, value }
            };
        };
        case 'reset':
            return initialState;
        default:
            return state;
    }
};

const ParticipantDialog = (props) => {
    const { open, closeDialog, addParticipant } = props;
    const smallViewPort = useMediaQuery('(max-width: 766px)');
    const [state, dispatch] = useReducer(reducer, initialState);

    const { name, email, number } = state;
    const addButtonDisabled = Object.keys(state).some(field => state[field].value === '' || !state[field].isValid);

    const fieldChangeHandler = ({ target }) => dispatch({ type: 'update', field: target.name, value: target.value })
    const fieldBlurHandler = ({ target }) => dispatch({ type: 'validate', field: target.name })
    const closeDialogHandler = () => {
        dispatch({ type: 'reset' });
        closeDialog();
    };
    const addParticipantHandler = () => {
        const participantObject = Object.keys(state).reduce((obj, field) => ({ ...obj, [field]: state[field].value }), {});
        addParticipant(participantObject);
        closeDialogHandler();
    };

    return (
        <Dialog
            open={open}
            onClose={closeDialogHandler}
            fullScreen={smallViewPort}
            transitionDuration={{ enter: 300, exit: 10 }}
            aria-labelledby="add-new-participant"
        >
            <DialogTitle id="add-new-participant">Add Participant</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    margin="dense"
                    label="Paticipant Name"
                    placeholder="Elon Musk"
                    type="text"
                    name="name"
                    value={name.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!name.isValid}
                    helperText={!name.isValid && name.errorMsg}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Email"
                    placeholder="e.musk@mail.org"
                    type="email"
                    name="email"
                    value={email.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!email.isValid}
                    helperText={!email.isValid && email.errorMsg}
                />
                <TextField
                    fullWidth
                    multiline
                    required
                    margin="dense"
                    label="Phone number"
                    placeholder="+1 888 1234567"
                    type="tel"
                    name="number"
                    value={number.value}
                    onChange={fieldChangeHandler}
                    onBlur={fieldBlurHandler}
                    error={!number.isValid}
                    helperText={!number.isValid && number.errorMsg}
                />
                <Typography variant="caption" gutterBottom>
                    (all fields are required)
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialogHandler} color="primary">
                    Cancel
                </Button>
                <Button onClick={addParticipantHandler} color="primary" disabled={addButtonDisabled} >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ParticipantDialog;
