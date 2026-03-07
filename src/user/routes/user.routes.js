import express from 'express';
import userController from '../controller/user.controller.js';
import authenticate from '../../middleware/auth.js';
import authenticateRole from '../../middleware/authenticateRole.js';
import validate from '../../middleware/validate.js';
import { createUserDto, updateUserDto, loginDto } from '../dto/user.dto.js';

const router = express.Router();

router.post('/login', validate(loginDto), userController.login);
router.post('/', authenticate, authenticateRole('Admin'), validate(createUserDto), userController.create);
router.get('/', authenticate, userController.getAll);
router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, authenticateRole('Admin'), validate(updateUserDto), userController.update);
router.delete('/:id', authenticate, authenticateRole('Admin'), userController.delete);

export default router;
