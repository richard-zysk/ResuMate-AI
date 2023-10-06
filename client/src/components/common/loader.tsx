import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useAuth } from '../auth/authProvider';

export default function SimpleBackdrop() {
    const { loading, setLoading } = useAuth()
    const handleClose = () => {
        setLoading(false);
    };

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={handleClose}
            >
                <CircularProgress color="primary" />
            </Backdrop>
        </div>
    );
}