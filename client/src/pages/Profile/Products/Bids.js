import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Divider } from '@mui/material';
import moment from 'moment';
import { GetAllBids } from '../../../apicalls/products';
import { SetLoader } from '../../../redux/loadersSlice';

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({ product: selectedProduct._id });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      alert(error.message);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);

  return (
    <Dialog
      open={showBidsModal}
      onClose={() => setShowBidsModal(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Bids</DialogTitle>
      <DialogContent>
        <Typography variant="h6" color="textSecondary">
          Product Name: {selectedProduct.name}
        </Typography>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bid Placed On</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Bid Amount</TableCell>
              {/* <TableCell>Bid Date</TableCell> */}
              <TableCell>Message</TableCell>
              <TableCell>Contact Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bidsData.map((bid) => (
              <TableRow key={bid._id}>
                <TableCell>{moment(bid.createdAt).format("DD-MM-YYYY hh:mm a")}</TableCell>
                <TableCell>{bid.buyer.name}</TableCell>
                <TableCell>{bid.bidAmount}</TableCell>
                {/* <TableCell>{moment(bid.createAt).format("DD-MM-YYYY hh:mm a")}</TableCell> */}
                <TableCell>{bid.message}</TableCell>
                <TableCell>
                  <Typography>Phone: {bid.mobile}</Typography>
                  <Typography>Email: {bid.buyer.email}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowBidsModal(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Bids;
