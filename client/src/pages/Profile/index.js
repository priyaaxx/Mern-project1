import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Products from './Products';
import UserBids from './UserBids';
import NavbarHome from '../../components/NavbarHome';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function Profile() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ mt:0, mx: 'auto', width: '100%' }}>
            <NavbarHome/>
        
            <Box sx={{ mt: 3, width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                    <Tab label="Buy / Sell" />
                    <Tab label="Bids" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Products />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <UserBids/>
                </TabPanel>
            </Box>
        </Box>
    );
}

export default Profile;
