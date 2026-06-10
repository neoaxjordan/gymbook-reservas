import { User } from '../models/user.model';

export class UserService {
  async createUser(data: { email: string; name: string; password: string }) {
    return await User.create(data);
  }

  async getUserById(userId: string) {
    return await User.findById(userId);
  }

  async getAllClients() {
      return await User.find({ role: 'client' });
  }
}