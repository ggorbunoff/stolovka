import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      localStorage.removeItem('role');
      navigate('/login');
    };

    performLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;