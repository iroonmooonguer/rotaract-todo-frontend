import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            const { data } = await api.post('/auth/login', values);
            login(data.access_token);
            notification.success({ message: '¡Login exitoso!' });
            navigate('/tasks');
        } catch (err: any) {
            notification.error({
                message: 'Login fallido',
                description: err.response?.data?.message,
            });
        }
    };

    return (
        <Card title="Iniciar Sesión" style={{ maxWidth: 400, margin: '100px auto' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Entrar
                    </Button>
                </Form.Item>
                <Typography.Text>
                    ¿No tienes cuenta? <Link to="/auth/register">Regístrate</Link>
                </Typography.Text>
            </Form>
        </Card>
    );
}
