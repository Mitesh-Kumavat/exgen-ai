import { Router } from "express";
import { login, getAdmin, signUp, logout } from '../controller/admin.controller.js';
import { verifyAdmin } from "../middleware/index.js";

const router = Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get('/logout', verifyAdmin, logout)
router.get('/', verifyAdmin, getAdmin)

export default router;