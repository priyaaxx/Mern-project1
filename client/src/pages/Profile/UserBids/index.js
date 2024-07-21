import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Divider, Box } from '@mui/material';
import moment from 'moment';
import { GetAllBids } from '../../../apicalls/products';
import { SetLoader } from '../../../redux/loadersSlice';

function UserBids() {
    const [bidsData, setBidsData] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const getData = async () => {
        try {
          dispatch(SetLoader(true));
          const response = await GetAllBids({ buyer: user._id }); // Pass user._id as buyer
          dispatch(SetLoader(false));
    
          if (response.success) {
            // Filter out bids with null product (deleted products)
            const filteredBids = response.data.filter(bid => bid.product !== null);
    
            // Transform and format bids for display
            const transformedBids = filteredBids.map(bid => ({
              ...bid,
              product: bid.product.name, // Assuming product is always populated correctly
              seller: bid.seller ? bid.seller.name : 'Unknown Seller',
              createdAt: moment(bid.createdAt).format("DD-MM-YYYY hh:mm A"),
            }));
    
            setBidsData(transformedBids);
          } else {
            alert(response.message);
          }
        } catch (error) {
          dispatch(SetLoader(false));
          alert(error.message);
        }
      };

    useEffect(() => {
        if (user && user._id) {
            getData();
        }
    }, [user]);

    return (
        <Box>
            <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 2 }}>
                Bids
            </Typography>
            <Divider />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Bid Placed On</TableCell>
                        <TableCell>Seller</TableCell>
                        <TableCell>Bid Amount</TableCell>
                        <TableCell>Message</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bidsData.map((bid) => (
                        <TableRow key={bid._id}>
                            <TableCell>{bid.product}</TableCell>
                            <TableCell>{bid.createdAt}</TableCell>
                            <TableCell>{bid.seller}</TableCell>
                            <TableCell>{bid.bidAmount}</TableCell>
                            <TableCell>{bid.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

export default UserBids;
