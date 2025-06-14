import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import Login from '@/pages/Login.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { StudentAuthProvider } from '@/context/StudentContext.tsx'
import { Toaster } from 'sonner'
import { AdminAuthProvider } from '@/context/AdminContext.tsx'
import ExamLayout from '@/components/layouts/ExamLayout.tsx'
import DashboardLayout from '@/components/layouts/DashboardLayout.tsx'
import Dashboard from './pages/Dashboard'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
      </Route>
      <Route path='/login' element={<Login />} />

      {/* All student protected routes for the exam */}
      <Route path='/exam-window' element={<ExamLayout />} >

      </Route>

      {/* All admin protected routes for the dashboard */}
      <Route path='/dashboard' element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      } >

      </Route >
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
