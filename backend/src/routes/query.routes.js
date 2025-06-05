import { Router } from 'express';
import { getQueries, raiseQuery, resolveQuery } from '../controller/query.controller.js';
import { verifyStudent, verifyAdmin } from '../middleware/verifyAuth.js';

const router = Router();

router.get('/', verifyAdmin, getQueries);
router.put('/:queryId', verifyAdmin, resolveQuery);
router.post('/', verifyStudent, raiseQuery)

export default router;