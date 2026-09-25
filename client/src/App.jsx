import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Checkpoint from "./pages/Checkpoint";
import Teams from "./pages/Teams";
import Leaderboard from "./pages/Leaderboard";


// const PublicLayout = ({ children }) => {
//   return (
//     <>
//       <Navbar />
//       {children}
//       <Footer />
//     </>
//   );
// };


// Protect mentor-only pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("mentorToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Landing />}
        />


        {/* Mentor Login */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Mentor Checkpoint - Protected */}
        <Route
          path="/checkpoint"
          element={
            <ProtectedRoute>
              {/* <PublicLayout> */}
                <Checkpoint />
              {/* </PublicLayout> */}
            </ProtectedRoute>
          }
        />


        {/* Teams */}
        <Route
          path="/teams"
          element={
            // <PublicLayout>
              <Teams />
            // </PublicLayout>
          }
        />


        {/* Leaderboard */}
        <Route
          path="/leaderboard"
          element={
            // <PublicLayout>
              <Leaderboard />
            // </PublicLayout>
          }
        />


        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
};


export default App;