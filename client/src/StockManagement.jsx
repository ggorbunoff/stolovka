import React, { useState } from 'react';
import axios from 'axios';
import useRoleAuthorization from './AuthCheck';
import './StockManagement.css';

const StockManagement = ({ items, setItems }) => {
    const { isAuthorized, getAuthorizationMessage } = useRoleAuthorization(['staff']);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, quantity: 0, img: '' });
    const [editingItem, setEditingItem] = useState(null);

    const handleCreateItem = async () => {
        try {
            const response = await axios.post('http://localhost:5000/items', newItem, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setItems([...items, response.data]);
            setNewItem({ name: '', description: '', price: 0, quantity: 0, img: '' });
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleUpdateItem = async () => {
        try {
            await axios.put(`http://localhost:5000/items/${editingItem.id}`, editingItem, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/items/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    if (!isAuthorized()) {
        return <div>{getAuthorizationMessage()}</div>;
    }

    return (
        <div className="stock-management">
            <h1>Сток менеджмент</h1>
            
            <div className="create-item-form">
                <h2>Добавить товар</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} placeholder="Name" />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} placeholder="Description" />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input value={newItem.price} onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})} placeholder="Price" />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} placeholder="Quantity" />
                </div>
                <div className="form-group">
                    <label>Image URL:</label>
                    <input value={newItem.img} onChange={(e) => setNewItem({...newItem, img: e.target.value})} placeholder="Image URL" />
                </div>
                <button className="create-button" onClick={handleCreateItem}>Добавить товар</button>
            </div>

            <h2>Товары в наличии</h2>
            <div className="item-list">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        {editingItem && editingItem.id === item.id ? (
                            <div className="edit-form">
                                <input value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                                <input value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} />
                                <input type="number" value={editingItem.price} onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})} />
                                <input type="number" value={editingItem.quantity} onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})} />
                                <input value={editingItem.img} onChange={(e) => setEditingItem({...editingItem, img: e.target.value})} />
                                <button className="save-button" onClick={handleUpdateItem}>Save</button>
                                <button className="cancel-button" onClick={() => setEditingItem(null)}>Отмена</button>
                            </div>
                        ) : (
                            <>
                                <h3>{item.name}</h3>
                                <img src={item.img} alt={item.name} />
                                <p>{item.description}</p>
                                <p>Цена: {item.price}</p>
                                <p>Количество: {item.quantity}</p>
                                <button className="edit-button" onClick={() => setEditingItem(item)}>Редактировать</button>
                                <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Удалить</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockManagement;