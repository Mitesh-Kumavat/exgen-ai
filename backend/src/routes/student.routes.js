import { Router } from 'express'
import { loginStudent, getAllStudents, registerStudent, logout, getProfileInfo } from '../controller/student.controller.js'
import { verifyStudent } from '../middleware/verifyAuth.js'

const router = Router()

router.get('/', getAllStudents)
router.post('/login', loginStudent)
router.post('/signup', registerStudent)
router.get('/logout', verifyStudent, logout)
router.get('/me', verifyStudent, getProfileInfo)

export default router