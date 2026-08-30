import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/authStore";
import MusicList from "./pages/MusicList";
import MusicUpload from "./pages/MusicUpload";
import Musics from "./pages/Musics";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/music-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <MusicList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/music-upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <MusicUpload />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/musics" element={<Musics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
