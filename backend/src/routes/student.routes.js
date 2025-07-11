import { Router } from 'express'
import { loginStudent, getAllStudents, registerStudent, logout, getProfileInfo, getStudentInfo } from '../controller/student.controller.js'
import { verifyAdmin, verifyStudent } from '../middleware/verifyAuth.js'

const router = Router()

router.get('/', getAllStudents)
router.post('/login', loginStudent)
router.post('/signup', registerStudent)
router.get('/logout', verifyStudent, logout)
router.get('/me', verifyStudent, getProfileInfo)
router.get('/:studentId', verifyAdmin, getStudentInfo)

export default router