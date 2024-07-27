import React from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import ServiceIcon from '@mui/icons-material/Assignment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/Book'; // Import a suitable icon for "My Bookings"

function ResponsiveAppBar() {
  const { user, logout } = useAuth();
  const dashboardUrl = user?.userType === 'property-agents' ? '/manage-rooms' : '/dashboard';
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
      navigate('/');
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

  const handleDashboardClick = () => {
    navigate(dashboardUrl);
  };

  const handleStatisticsClick = () => {
    navigate('/dashboard-page');
  };

  const handleMyBookingsClick = () => {
    navigate('/my-bookings');
  };

  const role = localStorage.getItem('role');

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
          to={dashboardUrl}
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
        <Button color="inherit" onClick={handleDashboardClick}>
          Dashboard
        </Button>
        {role === 'property-agents' && (
          <Button color="inherit" onClick={handleStatisticsClick}>
            Statistics
          </Button>
        )}
        {user && role === 'registered-users' && (
          <Button
            color="inherit"
            onClick={handleMyBookingsClick}
            startIcon={<BookIcon />}
          >
            My Bookings
          </Button>
        )}
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
              <MenuItem onClick={handleLoginClick}>
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
