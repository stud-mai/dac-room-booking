import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBox from '@material-ui/icons/AddBox';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import * as actions from '../redux/actions';
import AddWorkspace from '../components/AddWorkspace';
import AvailableRooms from './AvailableRooms';

// import './App.css';
const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		marginLeft: drawerWidth,
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		width: `calc(100% - ${drawerWidth}px)`,
	},
}));

function App(props) {
	const { workspaces, newWorkspaceHostName, workspaceInfoStatus, addWorkspace } = props;
	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
	const addWorkspaceHandler = (newWorkspaceHost) => {
		if (!workspaces[newWorkspaceHost]) {
			addWorkspace(newWorkspaceHost);
		}
	}

	const currentWorkspace = props.location.pathname.substring(1);
	const { title: currentWorkspaceName = 'New Workapce', icon } = workspaces[currentWorkspace] || {};

	const drawer = (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<MenuList>
				<MenuItem component={Link} to="/" selected={'' === currentWorkspace}>
					<ListItemIcon>
						<AddBox />
					</ListItemIcon>
					<ListItemText primary="Add Workspace" />
				</MenuItem>
			</MenuList>
			<Divider />
			<MenuList>
				{Object.keys(workspaces).map((workspace) => {
					const { title, icon } = workspaces[workspace];
					return (
						<MenuItem key={workspace} component={Link} to={`/${workspace}`} selected={workspace === currentWorkspace}>
							<ListItemIcon>
								<Avatar alt={title} src={`https://${workspace}/roombooking/${icon}`} />
							</ListItemIcon>
							<ListItemText primary={title} />
						</MenuItem>
					)
				})}
			</MenuList>
		</div>
	);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					{ icon && <Avatar alt={currentWorkspaceName} src={`https://${currentWorkspace}/roombooking/${icon}`} /> }
					<Typography variant="h6" noWrap>
						{ currentWorkspaceName }
          			</Typography>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						variant="temporary"
						anchor={theme.direction === 'rtl' ? 'right' : 'left'}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<Switch>
					<Route exact path="/:workspace" component={AvailableRooms} />
					<Route path="/" render={
						props => <AddWorkspace
							{...props}
							newWorkspaceHostName={newWorkspaceHostName}
							workspaceInfoStatus={workspaceInfoStatus}
							onAddWorkspace={addWorkspaceHandler}
						/>
					}/>
				</Switch>
			</main>
		</div>
	);
}

const mapStateToProps = (state) => {
	const workspaces = state.workspaces;
	const defaultWorkspace = state[workspaces[0]];

	return { ...state };
}

const mapDispatchToProps = (dispatch) => ({
	addWorkspace: (workspaceHost) => dispatch(actions.addWorkspace(workspaceHost))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
