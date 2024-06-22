import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useRoleAuthorization = (allowedRoles) => {
    const navigate = useNavigate();

    const isAuthorized = useCallback(() => {
        const userRole = localStorage.getItem('role');
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate('/login'); 
            return false;
        }
        return true;
    }, [navigate, allowedRoles]);

    const getAuthorizationMessage = useCallback(() => {
        const userRole = localStorage.getItem('role');
        if (!userRole || !allowedRoles.includes(userRole)) {
            return "Сори, но у тебя нет доступа.";
        }
        return null;
    }, [allowedRoles]);

    return { isAuthorized, getAuthorizationMessage };
};

export default useRoleAuthorization;