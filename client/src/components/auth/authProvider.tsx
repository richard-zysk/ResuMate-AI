import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface IProvider {
    user: any;
    setUser: any;
    login: (data: any) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<IProvider>({} as IProvider);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    console.log("DA", data)
    setUser(data);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};