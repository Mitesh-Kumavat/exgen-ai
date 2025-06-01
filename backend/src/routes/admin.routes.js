import { Router } from "express";
import { login, getAdmin, signUp, logout, uploadStudentFromCsv, deleteStudent, deleteAllStudents, generateRandomPasswords, mailPassword, uploadPDF, deletePDF } from '../controller/admin.controller.js';
import { verifyAdmin } from "../middleware/verifyAuth.js";
import { uploadMiddleware } from '../middleware/multer.js'

const router = Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get('/logout', verifyAdmin, logout)
router.get('/', verifyAdmin, getAdmin)

// admin actions on student data...
router.post('/bulk-upload', verifyAdmin, uploadMiddleware, uploadStudentFromCsv)
router.delete('/student/:id', verifyAdmin, deleteStudent)
router.delete('/bluk-delete', verifyAdmin, deleteAllStudents);
router.get('/generate-password', verifyAdmin, generateRandomPasswords);
router.get('/mail-password', verifyAdmin, mailPassword);

// admin actions on uploading files...
router.post('/pdf', verifyAdmin, uploadMiddleware, uploadPDF);
router.delete('/pdf', verifyAdmin, deletePDF);

export default router;