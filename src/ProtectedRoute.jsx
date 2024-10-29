import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirecting(true);
    }
  }, [isAuthenticated]);

  if (redirecting) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
