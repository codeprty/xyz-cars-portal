import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    localStorage.setItem('token', token);

    (async () => {
      try {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = resp.data;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } catch (err) {
        console.error('Failed to fetch user after OAuth', err);
        navigate('/login');
      }
    })();
  }, [navigate]);

  return <div className="container"><p>Logging you in…</p></div>;
};

export default OAuthCallback;
