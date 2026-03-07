import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

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

setUser(userData);

  return result;
};

  const register = async (data) => {
    return await registerUser(data);
  };

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);