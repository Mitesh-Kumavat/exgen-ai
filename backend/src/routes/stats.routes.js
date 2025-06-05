import { Router } from 'express'
import { getBasicStats, getStatsByExamId } from '../controller/stats.controller.js';

const router = Router()

router.get('/', getBasicStats);
router.get('/:examId', getStatsByExamId)

export default router;