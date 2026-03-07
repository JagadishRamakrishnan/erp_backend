import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

class UserService {
  async createUser(userData) {
    return await User.create(userData);
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(userData);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await user.comparePassword(password);
    if (!isValid) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }
}

export default new UserService();
