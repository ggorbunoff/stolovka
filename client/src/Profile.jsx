import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useRoleAuthorization from './AuthCheck';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

// Sorting function
const sortOrders = (orders) => {
    return orders.sort((a, b) => b.id - a.id);
};

const Profile = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthorized, getAuthorizationMessage } = useRoleAuthorization(['user', 'staff']);
    const statusTranslations = {
        received: 'Уже готовим!',
        done: 'Заказ готов'
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const authorized = isAuthorized();
            if (!authorized) {
                setError(getAuthorizationMessage());
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/orders', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const sortedOrders = sortOrders(response.data);
                setOrders(sortedOrders);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch orders');
                setIsLoading(false);
                navigate('/login');
            }
        };

        fetchOrders();
    }, [isAuthorized, getAuthorizationMessage, navigate]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Header />
            <div className='main-content'>
                <h1>Мои заказы</h1>
                {orders.length === 0 ? (
                    <p className='cart-empty'>Самое время сделать первый заказ 👀</p>
                ) : (
                    <ul className='order-list'>
                        {orders.map((order) => (
                            <li className='order-card' key={order.id}>
                                <div className='order-info'>
                                    <h3>Заказ #{order.id}</h3>
                                    <p className={`status ${order.status === 'done' ? 'status-done' : 'status-received'}`}>{statusTranslations[order.status]}</p>
                                </div>
                                <ul className='order-items'>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            <p className='order-items-names'>
                                                {item.name} <span>— {item.quantity} шт. × {item.price} п.</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <p className='subscript'>Сумма: <span className='price'>{order.total_price}</span></p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Profile;
