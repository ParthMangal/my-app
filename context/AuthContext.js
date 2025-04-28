import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUser(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.message === 'Login successful') {
      const userRes = await fetch('http://localhost:5000/api/user', {
        credentials: 'include',
      });
      const userData = await userRes.json();
      if (userRes.ok) {
        setUser(userData);
        return true;
      }
    }
    return false;
  };

  const register = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.message === 'User registered successfully') {
      return true;
    }
    return data.error || 'Registration failed';
  };

  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}