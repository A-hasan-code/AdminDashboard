import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/Redux/slices/authslices"; 
import ProtectedRoute from "@/ProtectedRoute"; 
import "@/app.css";
import Protect from "./Protect";
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user,loading, error } = useSelector((state) => state.auth); 
console.log(user)
  useEffect(() => {
    
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <Routes>
      <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
