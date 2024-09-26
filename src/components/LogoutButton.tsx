import { useAuth } from '@/context/AuthContext';
import Button from './design-sytem/button';

export function LogoutButton() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return <Button colorScheme={"danger"} onClick={handleLogout}>Logout</Button>;
}