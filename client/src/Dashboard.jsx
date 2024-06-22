import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useRoleAuthorization from './AuthCheck';
import './Dashboard.css';

const Dashboard = () => {
    const { isAuthorized, getAuthorizationMessage } = useRoleAuthorization(['staff']);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get('http://localhost:5000/admin/orders', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(response.data);
        };

        if (isAuthorized()) {
            fetchOrders();
        }
    }, [isAuthorized]);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:5000/admin/order/${orderId}`, { status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAuthorized()) {
        return <div>{getAuthorizationMessage()}</div>;
    }

    const receivedOrders = orders.filter(order => order.status === 'received');
    const doneOrders = orders.filter(order => order.status === 'done');

    return (
        <div>
            <div className='main-content'>
                <h1>Дашборд</h1>
                <div className="dashboard-container">
                    <div className="dashboard-section">
                        <h2>Новые заказы</h2>
                        <div className="dashboard-scroll">
                            {receivedOrders.map((order) => (
                                <div key={order.id} className="dashboard-item">
                                    <h3>Заказ #{order.id}</h3>
                                    <p>ID заказчика: {order.user_id}</p>
                                    <p>Сумма: {order.total_price} points</p>
                                    <p>Статус: {order.status}</p>
                                    <button onClick={() => updateOrderStatus(order.id, 'done')}>Готов</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="dashboard-section">
                        <h2>Выполненные заказы</h2>
                        <div className="dashboard-scroll">
                            {doneOrders.map((order) => (
                                <div key={order.id} className="dashboard-item completed">
                                    <h3>Заказ #{order.id}</h3>
                                    <p>Сумма: {order.total_price} points</p>
                                    <p>Статус: {order.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;