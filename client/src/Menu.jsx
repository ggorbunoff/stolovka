import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; 
import kitchen from './img/kitchen.jpeg'

const Menu = ({ items, addToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Header/>
            <div className='main-content'>
                <div className='hero-pic'><img src={kitchen} alt="" /></div>
                
                <div className='menu-bar'>
                    <h1>Меню</h1>
                    <div className='input search'>
                        <input
                            type="text"
                            placeholder="Поиск блюд..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                </div>
                <ul className='item-layout'>
                    {filteredItems.map((item) => (
                        <li className='item' key={item.id}>
                            <div className='item-picture-small-container'>
                                <Link to={`/item/${item.id}`}>
                                    <img className='item-picture-small' src={item.img} alt={`Image of ${item.name}`} />
                                </Link>
                            </div>
                            <div className='item-content'>
                                <p className='item-name'>
                                    <Link to={`/item/${item.id}`}>{item.name}</Link>
                                </p>
                                <p className='price'> {item.price}</p>
                            </div>
                            <button className='btn-def' onClick={() => addToCart(item)}>В заказ</button>
                        </li>
                    ))}
                </ul>
                {filteredItems.length === 0 && (
                    <p className='no-results'>Ничего не найдено.</p>
                )}
            </div>
        </div>
    );
};

export default Menu;