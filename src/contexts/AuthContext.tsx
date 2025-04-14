
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in a real app, you'd call your API here
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const newUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0]
        };
        
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock signup - in a real app, you'd call your API here
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        const newUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name
        };
        
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/dashboard");
      } else {
        throw new Error("Please fill all fields");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("csvFileName");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
