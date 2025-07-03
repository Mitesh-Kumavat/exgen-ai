import { Router } from 'express';
import { getQueries, raiseQuery, resolveQuery } from '../controller/query.controller.js';
import { verifyAdmin } from '../middleware/verifyAuth.js';

const router = Router();

router.get('/', verifyAdmin, getQueries);
router.put('/:queryId', verifyAdmin, resolveQuery);
router.post('/', raiseQuery)

export default router;