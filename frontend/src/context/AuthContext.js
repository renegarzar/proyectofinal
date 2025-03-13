import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("🔍 Usuario cargado desde localStorage:", storedUser);
    return storedUser || null;
  });

  useEffect(() => {
    if (user) {
      console.log("Guardando usuario en localStorage:", user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.log("Eliminando usuario de localStorage");
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => {
    console.log("Usuario autenticado:", userData);
    setUser(userData);
  };

  const logout = () => {
    console.log("Cerrando sesión...");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
