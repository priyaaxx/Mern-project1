import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Products from './Products';
import Users from './Users';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import NavbarHome from '../../components/NavbarHome';

function Admin() {
  const navigate = useNavigate();
  const { user } = useSelector((state)=>state.users);
  useEffect(() => {
    if(user.role !== "admin"){
      navigate("/home");
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <NavbarHome/>
      <Tabs mt='2' value={selectedTab} onChange={handleChange}>
        <Tab label="Products" />
        <Tab label="Users" />
      </Tabs>
      {selectedTab === 0 && (
        <Box sx={{ p: 2 }}>
           <Products/>
        </Box>
      )}
      {selectedTab === 1 && (
        <Box sx={{ p: 2 }}>
          <Users />
        </Box>
      )}
    </Box>
  );
}

export default Admin;
