import express from 'express'

import { isUserRegistered } from '../controllers/userController/isUserRegistered.js'
import { checkExistingUser } from '../controllers/userController/existingUser.js';
import { validateRegistration } from '../services/register.js';

const router = express.Router()

router.post('/user/isRegistered', isUserRegistered);
router.post('/user/checkExistingUser', validateRegistration, checkExistingUser);


export default router