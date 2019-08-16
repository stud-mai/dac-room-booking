import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Carousel from 'nuka-carousel';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import * as actions from '../redux/actions';
import Timebar from '../components/Timebar';

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

    render() {
        const { workspace, match } = this.props;
        const { title, availableRooms, availableRoomsStatus } = workspace || {};

        console.log(workspace)

        // if (!workspace) return <Redirect to="/" />
        if (availableRoomsStatus !== 'LOADED') return <CircularProgress />

        return (
            <div>
                <Typography variant="h5" component="h3" align="center">
                    Available Rooms for {title}
                </Typography>
                <Grid container spacing={2}>
                    {availableRooms.map(({ name, location, equipment, size, capacity, images, avail }, index) => (
                        <Grid item xs={12} md={6} xl={4} key={`${name}-${index}`}>
                            <Card >
                                <CardHeader title={`Room ${name}`} />
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
                                <CardActions disableSpacing>
                                    {/* <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton> */}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state, { match }) => ({
    workspace: state.workspaces[match.params.workspace]
});

const mapDispatchToProps = (dispatch, { match }) => {
    const workspaceHost = match.params.workspace;

    return {
        getAvailableRooms: () => dispatch(actions.getAvailableRooms(workspaceHost)),
        setWorkspaceInfoStatus: (status) => dispatch(actions.setWorkspaceInfoStatus(status)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AvailableRooms);