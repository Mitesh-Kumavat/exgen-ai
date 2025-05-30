import { Router } from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/index.js';
import { generateExamPaperForStudent, getExamPapers } from '../controller/examPaper.controller.js';

const router = Router();

router.get('/', verifyAdmin, getExamPapers)
router.get('/:studentId', verifyStudent, generateExamPaperForStudent);

export default router;