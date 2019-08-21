import React from 'react';
import { Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(3, 2),
    },
    progress: {
        marginRight: theme.spacing(1),
    }
}));

const AddWorkspace = ({ hostname, status, onAddWorkspace, onHostnameChange }) => {
    const classes = useStyles();
    const hostnameChangeHandler = ({ target }) => onHostnameChange(target.value);
    const keyPressHandler = ({ key }) => key === 'Enter' && onAddWorkspace();

    if (status === 'LOADED') return <Redirect to={`/${hostname}`} />

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12}>
                <Typography variant="h5" component="h3" align="center" gutterBottom>
                    Adding New Workspace
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} xl={6}>
                <Paper className={classes.paper}>
                    <Typography variant="body1">
                        To add new workspace enter its host name:
                    </Typography>
                    <TextField
                        label="Workspace Hostname"
                        placeholder="workspace.dac.eu"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={hostname}
                        onChange={hostnameChangeHandler}
                        onKeyPress={keyPressHandler}
                        disabled={status === 'FETCHING'}
                        error={status === 'ERROR'}
                        helperText={status === 'ERROR' && "Oops... Some error occured. Please make sure the hostname is correct and try again"}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={onAddWorkspace}
                        disabled={status === 'FETCHING'}
                    >
                        {status === 'FETCHING' &&
                            <CircularProgress size={22} thickness={6} className={classes.progress} />
                        }
                        Add Workspace
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    )
};

export default AddWorkspace;
