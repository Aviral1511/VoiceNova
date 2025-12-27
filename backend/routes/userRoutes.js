import express from 'express';
import { askAssistant, getCurrentUser, updateAssistant } from '../controllers/userController.js';
import isAuth  from '../middlewares/isAuth.js';
import upload from '../configs/multer.js';

const router = express.Router();

router.get('/current',isAuth, getCurrentUser);
router.post('/update',isAuth,upload.single("assistantImage"), updateAssistant);
router.post('/askAssistant',isAuth, askAssistant);

export default router;