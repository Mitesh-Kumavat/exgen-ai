import { Router } from 'express';
import { verifyAdmin, verifyStudent } from '../middleware/verifyAuth.js';
import { submitAnswerSheet, updateMarks, getAnswerSheetById } from '../controller/answerSheet.controller.js';

const router = Router();

router.post('/:examId', verifyStudent, submitAnswerSheet);
router.put('/:answerSheetId', verifyAdmin, updateMarks)
router.get('/:answerSheetId', getAnswerSheetById)
export default router;