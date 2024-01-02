import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme  } from '@mui/material/styles'; 
import CssBaseline from '@mui/material/CssBaseline';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./Contexts/AuthContext.jsx";



const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")).render(

  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthContextProvider>
  </ThemeProvider>

);
