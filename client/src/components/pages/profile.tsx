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
import { Select, MenuItem } from '@mui/material';


const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: '/path-to-avatar-image.jpg',
    phone:'93456668796',
    role:'Frontend Developer' // Replace with the actual path to your user's avatar image
  });
  const [age, setAge] = React.useState('');

  const handleChange = (e:any) => {
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
      <Paper  sx={{ padding: 5, marginTop:12, border:'1px solid #556cd6', }}>
        <Avatar
          alt="User Avatar"
          src={user.avatar}
          sx={{ width: 90, height: 90, margin: '0 auto', marginTop:-11, background:'#556cd6' }}
        />
        <Typography variant="h5" gutterBottom sx={{textAlign:'center', marginBottom:4, mt:1, color:'#101828',}}>
          User Profile
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
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
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="Phone Number"
                fullWidth
                value={user.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                label="Role"
                name="Role"
                fullWidth
                value={user.email}
                onChange={handleChange}
              /> */}
              <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={user.role}
          label="Role"
          onChange={handleChange}
          sx={{width:'100%'}}
        >
          <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
          <MenuItem value="Backend Develpoer">Backend Develpoer</MenuItem>
          <MenuItem value="Tester">Tester</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
        </Select>

        {/* <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl> */}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 4 }}
          >
            Save
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
