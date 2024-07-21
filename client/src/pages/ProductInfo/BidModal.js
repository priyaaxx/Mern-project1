import React, { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';

function BidModal({ showBidModal, setShowBidModal, product, reloadData, handlePlaceBid }) {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageDialogTitle, setMessageDialogTitle] = useState('');
  const [messageDialogContent, setMessageDialogContent] = useState('');
  const [messageDialogSeverity, setMessageDialogSeverity] = useState('success');

  const handleSubmit = async () => {
    try {
      const formData = new FormData(formRef.current);
      const values = {
        bidAmount: formData.get('bidAmount'),
        message: formData.get('message'),
        mobile: formData.get('mobile'),
      };

      dispatch(SetLoader(true));
      const response = await handlePlaceBid(values);
      dispatch(SetLoader(false));

      if (response.success) {
        showMessageDialog('Bid added successfully', 'Success');
        reloadData();
        setShowBidModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showMessageDialog(error.message, 'Error');
      dispatch(SetLoader(false));
    }
  };

  const showMessageDialog = (message, title) => {
    setMessageDialogTitle(title);
    setMessageDialogContent(message);
    setMessageDialogSeverity(title === 'Success' ? 'success' : 'error');
    setMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={showBidModal}
        onClose={() => setShowBidModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Bid</DialogTitle>
        <DialogContent>
          <form ref={formRef}>
            <TextField
              autoFocus
              margin="dense"
              id="bidAmount"
              name="bidAmount"
              label="Bid Amount (₹)"
              type="number"
              fullWidth
              required
            />
            <TextField
              margin="dense"
              id="message"
              name="message"
              label="Message"
              multiline
              fullWidth
            />
            <TextField
              margin="dense"
              id="mobile"
              name="mobile"
              label="Mobile Number"
              type="tel"
              fullWidth
              pattern="[0-9]{10}"
              helperText="Enter 10-digit mobile number"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBidModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseMessageDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{messageDialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{messageDialogContent}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BidModal;
