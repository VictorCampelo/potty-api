import { User } from 'src/users/user.entity';

export default class UserUtils {
  static giveMeAValidUser(id = '123'): User {
    const user = new User();
    user.id = id;
    user.firstName = 'Rodrigo';
    user.lastName = 'Brito';
    user.neighborhood = 'Ininga';
    user.street = 'Rua Jornalista Helder Feitosa';
    user.addressNumber = 1131;
    user.city = 'Teresina';
    user.uf = 'PI';
    user.zipcode = '64049-905';

    return user;
  }
}
