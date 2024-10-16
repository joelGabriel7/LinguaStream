import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminChat from './pages/AdminChat';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>

          {/* Private routes */}

          <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminChat/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
