import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "employee" | "contractor" | "technician" | null;

interface User {
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: UserRole, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const savedUser = localStorage.getItem("shq_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      localStorage.removeItem("shq_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, role: UserRole, name: string) => {
    const newUser = { username, role, name };
    setUser(newUser);
    try {
      localStorage.setItem("shq_user", JSON.stringify(newUser));
      // Give the WebView a moment to settle storage
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (e) {
      console.error("Error saving user to localStorage", e);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("shq_user");
    } catch (e) {
      console.error("Error removing user from localStorage", e);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
