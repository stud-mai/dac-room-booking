import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const AddWorkspace = ({ newWorkspaceHostName, workspaceInfoStatus, onAddWorkspace }) => {
    const [newWorkspaceHost, setNewWorkspaceHost] = useState('acorp.dac.eu');
    const newWorkspaceHostChangeHandler = ({ target }) => setNewWorkspaceHost(target.value);
    const addWorkspaceHandler = () => onAddWorkspace(newWorkspaceHost);

    if (workspaceInfoStatus === 'LOADED') return <Redirect to={`/${newWorkspaceHostName}`} />

    return (
        <Paper>
            <Typography variant="h5" component="h3" align="center">
                New Workspace
        	</Typography>
            <Typography display="inline">
                http://
            </Typography>
            <TextField
                // className={classes.textField}
                placeholder="workspace.dac.eu"
                value={newWorkspaceHost}
                onChange={newWorkspaceHostChangeHandler}
                disabled={workspaceInfoStatus === 'FETCHING'}
            />
            <Typography display="inline">
                /roombooking
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={addWorkspaceHandler}
                disabled={workspaceInfoStatus === 'FETCHING'}
            >
                Add Workspace
            </Button>
        </Paper>
    )
};

export default AddWorkspace;
