import { User } from 'src/users/user.entity';

export default class Util {
  static giveMeAValidUser(id: string): User {
    const user = new User();
    user.id = id;
    user.street = 'Ininga';
    return user;
  }
}
