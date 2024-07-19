import React from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import ServiceIcon from '@mui/icons-material/Assignment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

function ResponsiveAppBar() {
  const { user, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLoginClick = () => {
    if (user) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleServiceRequestClick = () => {
    const userData = JSON.parse(sessionStorage.getItem('user')) || {};
    const userId = userData.user_id;
    const userType = userData.userType;

    navigate('/concern-request-list', {
      state: {
        userId: userId,
        userType: userType
      }
    });
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleOpenNavMenu}
          sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'block' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          DalVacation
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <>
            <Button
              color="inherit"
              onClick={handleServiceRequestClick}
              startIcon={<ServiceIcon />}
            >
              Service Request
            </Button>
            <Button
              color="inherit"
              onClick={handleOpenUserMenu}
              startIcon={<AccountCircle />}
            >
              {user.email}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={logout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
            <Button color="inherit" onClick={handleSignupClick}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCloseNavMenu}>Products</MenuItem>
        <MenuItem onClick={handleCloseNavMenu}>Pricing</MenuItem>
        <MenuItem onClick={handleCloseNavMenu}>Blog</MenuItem>
      </Menu>
    </AppBar>
  );
}

export default ResponsiveAppBar;
