import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice'; // Adjust the import path accordingly
import { useNavigate } from 'react-router-dom';

const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
    fontFamily: 'Montserrat, sans-serif',
}));

const Navbar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8bbd0 30%, #ec407a 90%)',
}));

const Title = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
    fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer', // Add pointer cursor to indicate clickability
}));

function NavbarHome() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(SetLoader(true)); // Start loader
            try {
                // Simulate data fetching
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(SetLoader(false)); // Stop loader
            }
        };

        fetchData();
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <Navbar position="static">
            <Toolbar>
                <Title variant="h6" onClick={() => navigate("/home")}>ThriftIt</Title>
                {['Men', 'Women', 'Kids', 'Accessories', 'Footwear'].map((category) => (
                    <Button key={category} color="inherit" onClick={() => navigate(`/${category.toLowerCase()}`)}>{category}</Button>
                ))}
                <Box sx={{ flexGrow: 1 }} />
                {user ? (
                    <>
                        <Button color="inherit" onClick={() => {
                            if (user.role === 'user') {
                                navigate('/profile');
                            } else {
                                navigate('/admin');
                            }
                        }}>{user.name}</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                )}
            </Toolbar>
        </Navbar>
    );
}

export default NavbarHome;
