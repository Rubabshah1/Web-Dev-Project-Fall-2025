import express from 'express';
import {
  signUp,
  signIn,
  signOut,
  getSession,
  refreshSession
} from '../controllers/authController.js';

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/session', getSession);
router.post('/refresh', refreshSession);

export default router;