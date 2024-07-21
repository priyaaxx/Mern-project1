import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { LoginUser } from "../../apicalls/users";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice'; // Adjust the import path accordingly

function Login() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [dialog, setDialog] = useState({ open: false, message: '', severity: 'success' });

    const isValidEmail = (value) => {
        return /\S+@\S+\.\S+/.test(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let formErrors = {};
        if (!isValidEmail(email)) {
            formErrors.email = "Email is not valid";
        }
        if (!password) {
            formErrors.password = "Password is required";
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            dispatch(SetLoader(true)); // Show loader
            try {
                const response = await LoginUser({ email, password });
                if (response.success) {
                    localStorage.setItem('token', response.data); // Store token
                    navigate('/home'); // Redirect to home page
                } else {
                    setDialog({ open: true, message: response.message, severity: 'error' });
                }
            } catch (error) {
                setDialog({ open: true, message: 'An error occurred. Please try again.', severity: 'error' });
            } finally {
                dispatch(SetLoader(false)); // Hide loader
            }
        } else {
            setDialog({ open: true, message: "Please check the form for errors", severity: 'error' });
        }
    };

    const handleCloseDialog = () => {
        setDialog({ ...dialog, open: false });
    };

    useEffect(() => {
        // Check if a token exists in localStorage
        if (localStorage.getItem("token")) {
            navigate('/home'); // Redirect to home page if token exists
        }
    }, [navigate]);

    return (
        <div
            style={{
                height: '100vh',
                background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className="p-2"
                >
                    <Box
                        className="p-4 shadow-lg"
                        style={{
                            background: theme.palette.primary.light,
                            borderRadius: '20px',
                            width: '350px'
                        }}
                    >
                        <Typography component="h1" variant="h5" className="text-center mb-3">
                            Login
                        </Typography>
                        <form onSubmit={handleSubmit} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                className="mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email || (errors.email ? "required" : "")}
                                InputLabelProps={{
                                    style: { color: 'black' }
                                }}
                                InputProps={{
                                    style: { backgroundColor: 'white' }
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                className="mb-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password || (errors.password ? "required" : "")}
                                InputLabelProps={{
                                    style: { color: 'black' }
                                }}
                                InputProps={{
                                    style: { backgroundColor: 'white' }
                                }}
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" className="mb-3">
                                Login
                            </Button>
                            <Typography className="text-center mb-3">- OR -</Typography>
                            <Typography className="text-center">
                                Don't have an account? <a href="/register" className="text-primary">Register</a>
                            </Typography>
                        </form>
                    </Box>
                </Grid>
            </Grid>
            <Dialog
                open={dialog.open}
                onClose={handleCloseDialog}
            >
                <DialogTitle>{dialog.severity === 'success' ? 'Success' : 'Error'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Login;
