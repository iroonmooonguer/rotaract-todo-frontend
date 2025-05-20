// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import TasksPage from './components/TasksPage'

export default function App() {
  const { token } = useAuth()

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {token ? (
        <>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      )}
    </Routes>
  )
}
