import userService from '../service/user.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class UserController {
  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, users);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return errorResponse(res, 'User not found', 404);
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) return errorResponse(res, 'User not found', 404);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      if (!result) return errorResponse(res, 'User not found', 404);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async login(req, res) {
    try {
      const result = await userService.login(req.body.email, req.body.password);
      if (!result) return errorResponse(res, 'Invalid credentials', 401);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new UserController();
