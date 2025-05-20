import { Button } from 'antd';
import { useAuth } from '../context/AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button type="primary" danger onClick={logout}>
      Cerrar sesión
    </Button>
  );
}
