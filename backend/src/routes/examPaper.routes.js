import { Router } from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/verifyAuth.js';
import { getExamPapers, startExam } from '../controller/examPaper.controller.js';

const router = Router();

router.get('/', verifyAdmin, getExamPapers)
router.get('/:examId', verifyStudent, startExam);

export default router;