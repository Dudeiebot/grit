import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }) {
  const token = sessionStorage.getItem("access");

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" />;
  }
  return children;
}
