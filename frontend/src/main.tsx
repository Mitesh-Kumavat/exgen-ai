import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import '@/index.css'
import App from '@/App.tsx'
import Login from '@/pages/auth/login'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { StudentAuthProvider } from '@/context/student-context'
import { Toaster } from 'sonner'
import { AdminAuthProvider } from '@/context/admin-context'
import ExamLayout from '@/components/layouts/exam-layout'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import Dashboard from '@/pages/Admin/dashboard'
import ManageExam from '@/pages/Admin/manage-exam'
import ExamDetailPage from '@/pages/Admin/exam-detail'
import ManageStudents from '@/pages/Admin/manage-students'
import ManageQueries from '@/pages/Admin/manage-queries'
import CreateExam from '@/pages/Admin/create-exam'
import ExamResult from '@/pages/Admin/exam-results'
import ExamWindow from './pages/Student/all-exams'
import ExamPage from './pages/Student/exam'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
      </Route>
      <Route path='/login' element={<Login />} />

      {/* All student protected routes for the exam */}
      <Route path='/exam-window' >

        <Route index element={
          <ExamLayout>
            <ExamWindow />
          </ExamLayout>}
        />

        <Route path=':examId' element={
          <ExamLayout >
            <ExamPage />
          </ExamLayout>}
        />

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
              <ExamDetailPage />
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
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AdminAuthProvider>
      <StudentAuthProvider>
        <RouterProvider router={router} />
      </StudentAuthProvider>
    </AdminAuthProvider>
    <Toaster />
  </ThemeProvider>
)