import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import profile from './icons/ux/profile.svg'
import cart from './icons/ux/cart.svg'
import logout from './icons/ux/logout.svg'

const Header = () => {
  const [balance, setBalance] = useState(0);

  const handleLogout = () => {
    navigate('/logout');
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/points', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('User points:', response.data.points);
        setBalance(response.data.points);
        console.log('Balance state updated:', response.data.points);
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    };

    fetchUserPoints();
  }, []);

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/menu"><img src={logo} alt="Stolovka logotype" /></Link>
        </div>
        <div className="nav-items">
        <div className="balance">{balance}</div>
          <Link to="/profile" >
            <img className="profile-button" src={profile} alt="profile icon" />
          </Link>
          <Link to="/cart" className="cart-button">
          <img className="cart-button" src={cart} alt="profile icon" />
          </Link>
          <Link to="/logout" className="logout-button" onClick={handleLogout}>
            <img className="logout-button" src={logout} alt="logout icon" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;