import { Router } from 'express';
import { verifyAdmin } from '../middleware/verifyAuth.js';
import { getResults, getResultById, convertResultToCSV, getResultByStudentAndExam, mailResultToStudent } from '../controller/result.controller.js';

const router = Router();

router.get('/exam/:examId', verifyAdmin, getResults);
router.get('/exam/:examId/csv', verifyAdmin, convertResultToCSV);
router.get('/:resultId', verifyAdmin, getResultById);
router.get('/student/:studentId/exam/:examId', getResultByStudentAndExam);
router.get('/:examId/mail-result', verifyAdmin, mailResultToStudent);

export default router;