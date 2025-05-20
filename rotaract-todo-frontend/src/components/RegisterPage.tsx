import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { api } from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            await api.post('/auth/register', values);
            notification.success({ message: 'Registro exitoso. Inicia sesión.' });
            navigate('/auth/login');
        } catch (err: any) {
            notification.error({
                message: 'Registro fallido',
                description: err.response?.data?.message,
            });
        }
    };

    return (
        <Card title="Registro" style={{ maxWidth: 400, margin: '100px auto' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="First Name" name="firstName">
                    <Input />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName">
                    <Input />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Registrarse
                    </Button>
                </Form.Item>
                <Typography.Text>
                    ¿Ya tienes cuenta? <Link to="/login">Entra</Link>
                </Typography.Text>
            </Form>
        </Card>
    );
}


