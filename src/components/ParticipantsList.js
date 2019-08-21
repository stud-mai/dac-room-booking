import React, { useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditRounded';


const ParticipantsList = ({ participants, removeParticipant }) => {
    const [open, setOpen] = useState(false);
    const toggleParticipantsList = () => setOpen(!open);

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItem button onClick={toggleParticipantsList}>
                <ListItemText primary={`Participants (${participants.length})`} />
                {!!participants.length && (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {participants.map(({ name, email, number }, index) => (
                    <List key={number} disablePadding>
                        <ListItem button>
                            <ListItemIcon>
                                <Avatar>
                                    {name.split(' ').map(word => word.charAt(0)).join('')}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={name} secondary={`${email}, ${number}`} />
                            <IconButton edge="end" aria-label="edit" onClick={() => removeParticipant(index)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => removeParticipant(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    </List>
                ))}
            </Collapse>
        </List>
    );
};

export default ParticipantsList;
