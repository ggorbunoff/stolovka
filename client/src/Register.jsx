import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { name, email, password });
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='form-container'>
            
            <form className='form' onSubmit={handleSubmit}>
                <h1>Регистрация</h1>
                <input className='input' type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className='input' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className='input' type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className='btn-def' type="submit">Создать аккаунт</button>
                <p>Есть аккаунт? <a className='text-link' href='/login'>Вход в аккаунт.</a></p>
            </form>
        </div>
    );
};

export default Register;
