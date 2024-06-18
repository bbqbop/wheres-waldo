import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  let { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username.trim()){
      setLocalError('Enter username.')
      return
    }
    if(!password.trim()){
      setLocalError('Enter password.')
      return
    }
    setLocalError('');
    const success = await login(username, password);
    if (success) {
      setLocalError(success.message)
      setTimeout(()=>{
          navigate("/")
      }, 1000)
  }
  };

  useEffect(() => {
    clearError()
  },[])

  return (
    <>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          id="username" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button type="submit" disabled={loading}>Submit</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {localError && <p>{localError}</p>}
      </form>
      <hr />
      <p>Not registered yet?</p>
      <Link to="/sign-up">Sign-Up </Link>
      
      <Link to="/">Home</Link>
    </>
  );
}
