import * as React from 'react';
import { Container, Box, Paper, Grid, useMediaQuery, CssBaseline, Button, IconButton, Typography, SpeedDialAction, useTheme, Tab, Tabs, Backdrop, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, } from '@mui/material';


function UserPromptDialog(props) {
    const {onClose, open} = props; // the dialog box's close handler and open state.
    const {dialogTitle, dialogDesc} = props;  // The dialog box's title and description text
    const {confirmAction, cancelAction} = props; // The confirm and cancel button's functions

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogDesc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAction ? cancelAction : handleClose}>Cancel</Button>
          <Button onClick={confirmAction ? confirmAction : handleClose} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default UserPromptDialog;

