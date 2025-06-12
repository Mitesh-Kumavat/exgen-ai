import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { StudentAuthProvider } from './context/StudentContext.tsx'
import { Toaster } from 'sonner'
import { AdminAuthProvider } from './context/AdminContext.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/exam-window' element={<div>Exam Window</div>} />
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <StudentAuthProvider>
        <RouterProvider router={router} />
      </StudentAuthProvider>
    </AdminAuthProvider>
    <Toaster />
  </StrictMode>,
)
