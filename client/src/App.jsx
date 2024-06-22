import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Menu from './Menu';
import Cart from './Cart';
import Profile from './Profile';
import Dashboard from './Dashboard';
import ItemPage from './ItemPage';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import StockManagement from './StockManagement';
import Logout from './Logout';

const App = () => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [items, setItems] = useState([]);

    const addToCart = useCallback((item) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
            if (existingItemIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            } else {
                const updatedCart = [...prevCart, { ...item, quantity: 1 }];
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            }
        });
    }, []);
    
    const removeFromCart = useCallback((index) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            updatedCart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/items');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
    
        fetchItems();
    }, []);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/menu" element={
                        <ProtectedRoute>
                            <Menu items={items} addToCart={addToCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                        <ProtectedRoute>
                            <Cart cart={cart} removeFromCart={removeFromCart} setCart={setCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/item/:id" element={
                        <ProtectedRoute>
                            <ItemPage items={items} addToCart={addToCart} />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/stock" element={
                        <ProtectedRoute>
                            <StockManagement items={items} setItems={setItems} />
                        </ProtectedRoute>
                    } />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;