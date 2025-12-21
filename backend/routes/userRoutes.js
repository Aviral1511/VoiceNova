import express from 'express';
import { getCurrentUser, updateAssistant } from '../controllers/userController.js';
import isAuth  from '../middlewares/isAuth.js';
import upload from '../configs/multer.js';

const router = express.Router();

router.get('/current',isAuth, getCurrentUser);
router.post('/update',isAuth,upload.single("assistantImage"), updateAssistant);

export default router;