import React, { Component, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import Carousel from 'nuka-carousel';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeftRounded';
import ChevronRight from '@material-ui/icons/ChevronRightRounded';
import BookmarkIcon from '@material-ui/icons/BookmarkRounded';

import Timebar from '../components/Timebar';
import * as actions from '../redux/actions';

class AvailableRooms extends Component {
    componentDidMount() {
        const { workspace, history } = this.props;
        // this.props.setWorkspaceInfoStatus('INITIAL');
        if (!workspace) {
            history.push("/");
        } else {
            this.props.getAvailableRooms();
        }
    }

    dateChangeHandler = (date) => {
        if (date.isValid()) {
            this.props.getAvailableRooms(date.valueOf())
        }
    }

    nextDateChangeHandler = () => {
        const { workspace: { availableRoomsForDate }, getAvailableRooms } = this.props;
        getAvailableRooms(dayjs(availableRoomsForDate).add(1, 'day').valueOf());
    }

    prevDateChangeHandler = () => {
        const { workspace: { availableRoomsForDate }, getAvailableRooms } = this.props;
        getAvailableRooms(dayjs(availableRoomsForDate).subtract(1, 'day').valueOf());
    }

    searchRoomNameChangeHandler = ({ target }) => this.props.filterRoomsByName(target.value);

    nextHourAvailabilityChangeHandler = ({ target }) => this.props.filterRoomsByNextHourAvailability(target.checked);

    render() {
        const { workspace, match } = this.props;
        const { filteredRooms, availableRoomsStatus, availableRoomsForDate, searchedRoomName, nextHourAvailability } = workspace || {};
        const dateIsToday = dayjs(availableRoomsForDate).isSame(Date.now(), 'date');

        console.log(workspace)

        if (availableRoomsStatus !== 'LOADED') return <CircularProgress />

        return (
            <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Typography variant="h5" component="h3" align="center">
                    Available Rooms for
                </Typography>
                <IconButton onClick={this.prevDateChangeHandler} disabled={dateIsToday} aria-label="previous day">
                    <ChevronLeft />
                </IconButton>
                <DatePicker
                    disablePast
                    placeholder="20/10/2020"
                    value={availableRoomsForDate}
                    onChange={this.dateChangeHandler}
                    format="DD MMMM YYYY"
                />
                <IconButton onClick={this.nextDateChangeHandler} aria-label="next day">
                    <ChevronRight />
                </IconButton>
                <Paper className={"classes.root"}>
                    <Typography variant="body1" component="span">
                        Filter:
                    </Typography>
                    <TextField
                        // className={clsx(classes.textField, classes.dense)}
                        margin="dense"
                        variant="outlined"
                        placeholder="Enter room name"
                        value={searchedRoomName}
                        onChange={this.searchRoomNameChangeHandler}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={nextHourAvailability}
                                onChange={this.nextHourAvailabilityChangeHandler}
                                color="primary"
                            />
                        }
                        label="Available next hour"
                        disabled={!dateIsToday}
                    />
                </Paper>
                <Grid container spacing={2}>
                    {filteredRooms.map(({ name, location, equipment, size, capacity, images, avail }, index) => (
                        <Grid item xs={12} md={6} xl={4} key={`${name}-${index}`}>
                            <Card>
                                <CardHeader
                                    title={`Room ${name}`}
                                    action={
                                        <IconButton aria-label="settings" title="Book the room" onClick={console.log}>
                                            <BookmarkIcon />
                                        </IconButton>
                                    }
                                />
                                <Carousel>
                                    {images.map(image => (
                                        <CardMedia
                                            key={image}
                                            component="img"
                                            image={`https://${match.params.workspace}/roombooking/${image}`}
                                            title={`Room ${name}`}
                                            height="140"
                                        />
                                    ))}
                                </Carousel>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <b>Location:</b> {location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <b>Capacity:</b> {`${capacity} person${capacity > 1 ? 's' : ''}`}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <b>Equipment:</b> {equipment.join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <b>Size:</b> {size}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="div">
                                        <b>Availability:</b>
                                        <Timebar availablePeriods={avail} />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </MuiPickersUtilsProvider>
        )
    }
}

const mapStateToProps = (state, { match }) => ({
    workspace: state.workspaces[match.params.workspace]
});

const mapDispatchToProps = (dispatch, { match }) => {
    const workspaceHost = match.params.workspace;

    return {
        getAvailableRooms: (date) => dispatch(actions.getAvailableRooms(workspaceHost, date)),
        // setWorkspaceInfoStatus: (status) => dispatch(actions.setWorkspaceInfoStatus(status)),
        filterRoomsByName: (roomName) => dispatch(actions.filterRoomsByName(workspaceHost, roomName)),
        filterRoomsByNextHourAvailability: (checked) => dispatch(
            actions.filterRoomsByNextHourAvailability(workspaceHost, checked)
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailableRooms);