import { Router } from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/verifyAuth.js';
import { submitAnswerSheet } from '../controller/answerSheet.controller.js';

const router = Router();

router.post('/:examId', verifyStudent, submitAnswerSheet);

export default router;