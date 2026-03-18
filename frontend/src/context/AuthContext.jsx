import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // Restore user from localStorage on refresh
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const isVerified = localStorage.getItem("isVerified");

    if (token && role) {

      setUser({
        name,
        email,
        role,
        isVerified: isVerified === "true"
      });

    }

  }, []);


  // LOGIN
  const login = async (data) => {

    const result = await loginUser(data);

    const token = result.token || result.data?.token;
    const userData = result.user || result.data?.user;

    if (token) {
      localStorage.setItem("token", token);
    }

    if (userData?.role) {
      localStorage.setItem("userRole", userData.role);
    }

    if (userData?.name) {
      localStorage.setItem("userName", userData.name);
    }

    if (userData?.email) {
      localStorage.setItem("userEmail", userData.email);
    }

    if (userData?.isVerified !== undefined) {
      localStorage.setItem("isVerified", userData.isVerified);
    }

    setUser(userData);

    return result;

  };


  // REGISTER
  const register = async (data) => {

    return await registerUser(data);

  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isVerified");

    setUser(null);

  };


  return (

    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>

  );

};

export const useAuth = () => useContext(AuthContext);