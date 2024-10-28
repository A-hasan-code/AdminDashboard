import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  // Correctly accessing the isAuthenticated state
  const { isAuthenticated } = useSelector((state) => state.auth); 

  console.log("ProtectedRoute - Authenticated:", isAuthenticated); // Log for debugging

  return isAuthenticated ? element : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;
