import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: '/path-to-avatar-image.jpg', // Replace with the actual path to your user's avatar image
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission, e.g., update user profile data on the server
    console.log('Updated user profile:', user);
  };

  return (
    <Container maxWidth="sm">
      <Paper  sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>
        <Avatar
          alt="User Avatar"
          src={user.avatar}
          sx={{ width: 100, height: 100, margin: '0 auto' }}
        />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={user.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={user.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Save Changes
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
