import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', {
        email,
        password
      });
      
      // Save token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert('Login successful');
      
      // Redirect based on role
      const role = res.data.user?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'ngo') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/volunteer/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-success" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
