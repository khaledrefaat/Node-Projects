import { Router } from 'express';
import { getLogin, getLogout, postLogin } from '../controllers/authControllers';

const router = Router();

router.get('/login', getLogin);

router.get('/logout', getLogout);

router.post('/login', postLogin);

export default router;
