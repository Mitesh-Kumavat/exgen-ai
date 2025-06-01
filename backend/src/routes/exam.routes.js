import { Router } from 'express';
import { createExam, deleteExam, getAllExams, getExamById, updateStatus } from '../controller/exam.controller.js';
import { verifyAdmin } from '../middleware/verifyAuth.js';
const router = Router();

router.post('/', verifyAdmin, createExam);
router.get('/', verifyAdmin, getAllExams);
router.get('/:examId', verifyAdmin, getExamById);
router.put('/:examId', verifyAdmin, updateStatus);
router.delete('/:examId', verifyAdmin, deleteExam);

export default router;