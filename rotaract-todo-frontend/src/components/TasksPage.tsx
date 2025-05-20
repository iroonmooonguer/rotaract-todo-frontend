import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Checkbox, Space, notification } from 'antd';
import { api } from '../api/axios';
import { LogoutButton } from './LogoutButton';

interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  // Hook para controlar el formulario
  const [form] = Form.useForm();

  const fetch = async () => {
    setLoading(true);
    const { data } = await api.get<Task[]>('/tasks');
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  // Cada vez que cambie "editing" o "modalOpen" sincronizamos los valores del formulario
  useEffect(() => {
    if (modalOpen) {
      if (editing) {
        form.setFieldsValue(editing);
      } else {
        form.resetFields();
      }
    }
  }, [editing, modalOpen, form]);

  const onFinish = async (vals: any) => {
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, vals);
        notification.success({ message: 'Tarea actualizada' });
      } else {
        await api.post('/tasks', vals);
        notification.success({ message: 'Tarea creada' });
      }
      setModalOpen(false);
      setEditing(null);
      fetch();
    } catch (err: any) {
      notification.error({ message: 'Error', description: err.response?.data?.message });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      notification.success({ message: 'Tarea eliminada' });
      fetch();
    } catch {
      notification.error({ message: 'Error al eliminar' });
    }
  };

  const openModalForEdit = (task: Task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      className: 'col-description',
    },
    {
      title: 'Completada',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      render: (v: boolean) => (v ? 'Sí' : 'No'),
      className: 'col-completed',
    },
    {
      title: 'Acciones',
      key: 'actions',
      className: 'col-actions',
      render: (_: any, record: Task) => (
        <Space size="small" wrap>
          <Button size="small" onClick={() => openModalForEdit(record)}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => onDelete(record.id)}>
            Borrar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type="primary" onClick={openModalForCreate}>
          Nueva tarea
        </Button>
        <LogoutButton />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={tasks}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editing ? 'Editar Tarea' : 'Crear Tarea'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ description: '', isCompleted: false }}
        >
          <Form.Item label="Descripción" name="description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isCompleted" valuePropName="checked">
            <Checkbox>Completada</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editing ? 'Actualizar' : 'Crear'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
