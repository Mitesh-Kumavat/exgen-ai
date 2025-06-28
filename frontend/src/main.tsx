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
import Dashboard from '@/pages/Admin/Dashboard'
import ManageExam from '@/pages/Admin/ManageExam'
import ExamDetail from '@/pages/Admin/ExamDetail'
import ManageStudents from '@/pages/Admin/ManageStudents'
import ManageQueries from '@/pages/Admin/ManageQueries'
import CreateExam from '@/pages/Admin/CreateExam'
import ExamResult from '@/pages/Admin/ExamResult'

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
      <Route path='/dashboard'>
        <Route index element={<DashboardLayout >
          <Dashboard />
        </DashboardLayout>} />

        <Route path='create-exam' element={<DashboardLayout >
          <CreateExam />
        </DashboardLayout>} />

        <Route path='manage-exams'>
          <Route index element={
            <DashboardLayout >
              <ManageExam />
            </DashboardLayout>} />

          <Route path=':examId' element={
            <DashboardLayout >
              <ExamDetail />
            </DashboardLayout>} />

          <Route path=':examId/result' element={
            <DashboardLayout >
              <ExamResult />
            </DashboardLayout>} />

        </Route>

        <Route path='manage-students' element={<DashboardLayout >
          <ManageStudents />
        </DashboardLayout>} />

        <Route path='manage-queries' element={<DashboardLayout >
          <ManageQueries />
        </DashboardLayout>} />
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
