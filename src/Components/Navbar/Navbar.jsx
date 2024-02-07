import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button"; // Importar Button de Material-UI
import { logout } from "../../Stores/AccessTokenStore";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../Contexts/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [method] = React.useState("");
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const settings = ["Profile", "Logout"];
  const pages = [];

  switch (user.role) {
    case "Administrador SinCeO2":
      pages.push("Clientes", "Cursos", "Usuarios");
      break;
    case "Administrador":
      pages.push("Mis Cursos", "Usuarios");
      break;
    case "Usuario":
      pages.push("Mis Cursos");
      break;
    default:
      break;
  }

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

  const handleRoute = (page) => {
    switch (page) {
      case "Clientes":
        return "Clients";
      case "Cursos":
        return "Courses";
      case "Mis Cursos":
        return "MyCourses";
      case "Usuarios":
        return "Users";
      default:
        break;
    }
  };

  const handleRouteClick = (page) => {
    const route = handleRoute(page).toLowerCase();
    return `/${route}`;
  };

  const handleSettingsClick = (setting) => {
    switch (setting) {
      case "Profile":
        navigate(`/users/profile/${user.id}`);
        break;
      case "Logout":
        logout();
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={`/mycourses/${user.id}`}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {user.company.name}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page}>
                  <Button
                    component={Link} // Usar Button como componente y pasar Link como la ubicación
                    to={handleRouteClick(page)}
                    color="primary"
                    sx={{
                      my: 2,
                      
                      display: "block",
                      marginLeft: 2,
                      textDecoration: "none",
                    }}
                  >
                    {page}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href={`/mycourses/${user.id}`}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {user.company.name}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                component={Link} 
                href={method}
                key={page}
                to={handleRouteClick(page)}
                sx={{ my: 2, color: "white", display: "block", marginLeft: 2, textDecoration: "none"}}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* AVATAR */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={user.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleSettingsClick(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
