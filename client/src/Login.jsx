import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role)
            navigate('/menu');
        } catch (error) {
            setError('Incorrect email or password'); //
            console.error(error);
        }
    };

    return (
        <div className='form-container'>
                <form className='form' onSubmit={handleSubmit}>
                    <h1>Вход</h1>
                    <input className='input' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input className='input' type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className='btn-def' type="submit">Войти</button>
                    {error && <p >{error}</p>} {/* текст ошибки */}
                    <p>Нет аккаунта? <a className='text-link' href='/register'>Зарегистрируйтесь сейчас!</a></p>
                </form>
        </div>
    );
};

export default Login;
