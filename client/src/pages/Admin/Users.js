import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import moment from 'moment';
import { GetAllUsers, UpdateUserStatus } from '../../apicalls/users';
import { SetLoader } from '../../redux/loadersSlice';

function Users() {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        dispatch(SetLoader(true));
        try {
            const response = await GetAllUsers(null);
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    const onStatusUpdate = async (id, newStatus) => {
        dispatch(SetLoader(true));
        try {
            const response = await UpdateUserStatus(id, newStatus);
            if (response.success) {
                fetchUsers(); // Refresh users after updating status
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            dispatch(SetLoader(false));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Added On</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{user.role.toUpperCase()}</TableCell>
                                <TableCell>{moment(user.createdAt).format("DD-MM-YYYY hh:mm A")}</TableCell>
                                <TableCell>
                                    <div className="flex gap-3">
                                        {user.status.toLowerCase() === "active" && (
                                            <span
                                                className="underline cursor-pointer"
                                                onClick={() => onStatusUpdate(user._id, "blocked")}
                                            >
                                                Block
                                            </span>
                                        )}
                                        {user.status.toLowerCase() === "blocked" && (
                                            <span
                                                className="underline cursor-pointer"
                                                onClick={() => onStatusUpdate(user._id, "active")}
                                            >
                                                Unblock
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Users;
