// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const port = import.meta.env.VITE_SERVER;

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token')
    const isTokenExpired = (token) => {
      if (!token) return true;
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const isExpired = decodedToken.exp < currentTime;
        if (isExpired){
          setError('Authentication token is expired, log in again.');
          return true
        } else false
      } catch (error) {
        setError('Error decoding token, log in again.');
        return true;
      }
    }
    if (token && !isTokenExpired(token)){
      setIsLoggedIn(true);
      setUser(JSON.parse(localStorage.getItem('user')))
    } else {
      setIsLoggedIn(false);
      setUser(null)
      localStorage.clear()
    } 
  };

  useEffect(() => {
    checkTokenValidity()
    const intervalId = setInterval(checkTokenValidity, 10000)
    return () => clearInterval(intervalId);
  },[])

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${port}/user/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if(data.error){
        throw new Error(data.error)
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user))
      setIsLoggedIn(true);
      setUser(data.user);
      return data;

    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  const signUp = async (username, password, firstname, lastname) => {
    setLoading(true);
    setError(false);

    try {
        const response = await fetch(`${port}/user/sign-up`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, firstname, lastname })
        });

        const data = await response.json()

        if(data.error){
            throw new Error(data.error)
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setIsLoggedIn(true);
        setUser(data.user)
        return data
    } catch(error) {
        setError(error.message)
        return false;
    } finally {
        setLoading(false)
    }
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, loading, error, login, logout, signUp, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
