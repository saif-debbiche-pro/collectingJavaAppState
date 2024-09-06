import React, { useState } from 'react';
import {login} from '../api/authService'
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Container, createTheme, CssBaseline, Grid, Link, TextField, ThemeProvider, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';




const LoginForm: React.FC = () => {
  const theme = createTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string|null>('');

  const navigate =useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you can add the logic to handle the login (e.g., API call)
    login(email,password).then( data=>{

        localStorage.setItem('accessToken', data.accessToken);
        navigate('/apps')
    }).catch(err=>{
      setEmail("");
      setPassword("")
      setError("bad credentials")
    })
    

  };

  return (
    <div className="login-container" style={{
      width:"100vw",
      height:"100vh"
    }}>
      
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setError(null);
                setEmail(e.target.value)}}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setError(null);
                setPassword(e.target.value)}}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
</div>)
    }


export default LoginForm;