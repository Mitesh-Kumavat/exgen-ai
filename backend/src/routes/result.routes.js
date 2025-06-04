import { Router } from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/verifyAuth.js';
import { getResults, getResultById, convertResultToCSV, getResultByStudentAndExam } from '../controller/result.controller.js';

const router = Router();

router.get('/exam/:examId', verifyAdmin, getResults);
router.get('/exam/:examId/csv', verifyAdmin, convertResultToCSV);
router.get('/:resultId', verifyAdmin, getResultById);
router.get('/student/:studentId/exam/:examId', verifyStudent, getResultByStudentAndExam);

export default router;