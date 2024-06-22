import React, { useState } from 'react';
import axios from 'axios';
import useRoleAuthorization from './AuthCheck';
import Header from './Header'; 
import Modal from './Modal';

const Cart = ({ cart, removeFromCart, setCart }) => {
    const [workspaceNumber, setWorkspaceNumber] = useState('');
    const [error, setError] = useState('');
    const { isAuthorized } = useRoleAuthorization(['user', 'staff']);
    const isCartEmpty = cart.length === 0;
    const totalSum = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', isSuccess: true });

    const clearCart = () => {
        setCart([]); 
        localStorage.removeItem('cart');
    };

    const handleOrder = async () => {
        if (!workspaceNumber.trim()) {
            setError('Пожалуйста, введите номер рабочего места');
            return;
        }
        try {
            if (!isAuthorized()) {
                return;
            }

            const items = cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity // Add quantity here
            }));
            const total_price = cart.reduce((total, item) => total + item.price * item.quantity, 0);
            await axios.post('http://localhost:5000/order', {
                items,
                total_price
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setModalContent({
                title: 'Заказ принят!',
                message: 'Ожидайте готовность в течение 15 минут.',
                isSuccess: true
            });
            setModalIsOpen(true);
            clearCart();
            setWorkspaceNumber('');
            setError('');
        } catch (error) {
            console.error(error);
            setModalContent({
                title: 'Кажись, не хватает',
                message: 'Попробуй заработать еще поинтов.',
                isSuccess: false
            });
            setModalIsOpen(true);
        }
    };

    const incrementQuantity = (index) => {
        const newCart = [...cart];
        newCart[index].quantity += 1;
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const decrementQuantity = (index) => {
        const newCart = [...cart];
        if (newCart[index].quantity > 1) {
            newCart[index].quantity -= 1;
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            removeFromCart(index); // Remove the item if quantity goes below 1
        }
    };

    return (
        <div>
            <Header/>
            <div className='main-content'>
            <h1>Корзина</h1>
            {isCartEmpty ? (
                <p className='cart-empty'>В корзине пусто 🥲 Добавьте что-нибудь, чтобы можно было оформить заказ.</p>
            ) : (
                <div className='cart'>
                    <ul className='cart-items'>
                        {cart.map((item, index) => (
                            <li className='cart-item' key={index}>
                            <img className='item-picture-small' src={item.img} alt={`Image of ${item.name}`} />
                               <div className='itm-wrapper'>
                                    <p className='item-name'>{item.name}</p> 
                                    <div className='quantity-control'>
                                            <button className='quantity-btn' onClick={() => decrementQuantity(index)}>-</button>
                                            <p className='quantity'> × {item.quantity}</p>
                                            <button className='quantity-btn' onClick={() => incrementQuantity(index)}>+</button>
                                        </div>
                                    <div className='cart-items-wrapper'>
                                        <p className='price'>{item.price}</p>
                                        <button className='btn-secondary' onClick={() => removeFromCart(index)}>Убрать из заказа</button>
                                    </div>
                               </div>
                            </li>
                        ))}
                    </ul>
                    <p className='subscript'>Итого: <span className='price'> {totalSum}</span> </p>
                    <input className='input'
                        type="text"
                        placeholder="Номер рабочего места:"
                        value={workspaceNumber}
                        onChange={(e) => {setWorkspaceNumber(e.target.value); setError('');}}
                    />
                    {error && <p className='error-message'>{error}</p>}
                    <button className='btn-def' onClick={handleOrder} disabled={isCartEmpty}>
                        Оформить заказ
                    </button>
                </div>
            )}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                title={modalContent.title}
                message={modalContent.message}
                isSuccess={modalContent.isSuccess}
            />
        </div>
    );
};

export default Cart;
