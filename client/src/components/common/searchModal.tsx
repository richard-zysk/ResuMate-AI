import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { useAuth } from '../auth/authProvider';
import { apipost } from '../../services/axiosClient';


interface modalProps {
    open: boolean;
    setOpen: any;
}
export default function SearchModal(props: modalProps) {
const { open, setOpen} = props;
const { setMessage, setSnackOpen} = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
    //   const response = await apipost("/pdf/login", data);
      console.log(event.currentTarget);
    } catch (err: any) {
      console.log(err);
      setSnackOpen(true);
      setMessage({ msg: "Not able to search now. Please try again", color: "error" })
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
      <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
        <DialogTitle>Search for resumes!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter search prompt to filter out resumes
          </DialogContentText>
             <TextField
            autoFocus
            margin="dense"
            id="searchText"
            label="Search text"
            multiline
            rows={5}
            fullWidth
            variant="standard"
          />
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Search</Button>
        </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}