import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Grid} from '@mui/material';
import {Menu as MenuIcon, Adb as AdbIcon} from '@mui/icons-material';


const SwiftlyAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{p: {xs: 1, md: 0}}}>
      <Container maxWidth={false} fixed={false}>
        <Toolbar disableGutters >
          <Grid container direction={"row"} alignItems="center" justifyContent={"space-between"}>
          {/* Swiftly icon and text when viewport is md or greater */}
          <Box  sx={{ display: 'flex', flexDirection: 'row' }}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="h6"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              SWIFTLY
            </Typography>
          </Box>
          
          
          {/* TODO: DELETE THIS */}
          {/* Swiftly icon and Text when viewport size = xs*/}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> {/*Place holder icon*/}
          <Typography
            variant="h5"
            noWrap
            component="h5"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SWIFTLY
          </Typography>

            {/* Page links displayed side by side when viewport size is md or larger */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box> */}

          
          <Typography variant='h5'>
            Welcome, {props.profileDetails ? props.profileDetails.username : "{USER_NAME_NOT_FOUND}"}
          </Typography>
            
            {/* User icon on right side with clickable menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar >{props.profileDetails ? ( props.profileDetails.country == "" ? "BUTT" : (props.profileDetails.firstname[0]+props.profileDetails.lastName[0]).toUpperCase() ): "NaN"}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={'profile'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem key={'manage_account'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Manage account</Typography>
              </MenuItem>
              <MenuItem key={'real_logout'} onClick={props.handleLogout}>
                <Typography textAlign="center">logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default SwiftlyAppBar;
