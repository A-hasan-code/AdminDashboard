import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Protect = ({ element }) => {
  const { isAuthenticated } = useSelector((state) =>state.auth);
  

  if (isAuthenticated) {
    
    return <Navigate to="/dashboard/home" />;
  }else{
    console.log(element)
     return <Navigate to="/auth/sign-in" />;

  }

 

};

export default Protect;
