import React, { useEffect, useState } from 'react';
import { GetCurrentUser } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import ErrorDialog from './ErrorDialog';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { SetLoader } from '../redux/loadersSlice'; // Adjust the import path accordingly

function ProtectedPage({ children }) {
  // const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.users);

  const validateToken = async () => {
    dispatch(SetLoader(true)); // Set loader to true
    try {
      const response = await GetCurrentUser();
      dispatch(SetLoader(false)); // Set loader to false

      if (response.success) {
        // setUser(response.data);
        dispatch(SetUser(response.data));
      } else {
        setError(response.message);
        setDialogOpen(true);
        navigate('/login'); // Redirect to login page on token validation failure
      }
    } catch (error) {
      dispatch(SetLoader(false)); // Set loader to false
      setError(error.message);
      setDialogOpen(true);
      navigate('/login'); // Redirect to login page on token validation failure
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setError(null);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      validateToken();
    } else {
      navigate('/login'); // Redirect to login page if token is not present
    }
  }, [navigate]);

  return (
    <div>
      {user && (
        <div className="p-5">
          {/* {user.name} */}
          {children}
        </div>
      )}
      {error && (
        <ErrorDialog
          errorMessage={error}
          open={dialogOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default ProtectedPage;
