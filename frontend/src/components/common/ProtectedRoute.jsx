import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const role = localStorage.getItem("userRole");
  const isVerified = localStorage.getItem("isVerified") === "true";
  const location = useLocation();

  // Not logged in
  if (!role) {
    return <Navigate to="/login" />;
  }

  // Role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // Guide not verified but trying to access dashboard
  if (
    role === "guide" &&
    !isVerified &&
    location.pathname !== "/guide/license"
  ) {
    return <Navigate to="/guide/license" />;
  }

  return children;
};

export default ProtectedRoute;