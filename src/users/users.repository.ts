import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EntityRepository, Repository } from 'typeorm';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.enabled = queryDto.enabled === undefined ? true : queryDto.enabled;
    queryDto.offset = queryDto.offset < 1 ? 1 : queryDto.offset;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, firstName, lastName, enabled, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.enabled = :enabled', { enabled });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (firstName) {
      query.andWhere('user.name ILIKE :name', { name: `%${firstName}%` });
    }

    if (lastName) {
      query.andWhere('user.name ILIKE :name', { name: `%${lastName}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.enabled']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const {
      email,
      firstName,
      lastName,
      password,
      zipcode,
      street,
      addressNumber,
      neighborhood,
      complement,
      city,
      uf,
      logradouro,
      googleId,
      facebookId,
    } = createUserDto;

    const user = this.create();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    user.enabled = false;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.zipcode = zipcode;
    user.street = street;
    user.addressNumber = addressNumber;
    user.neighborhood = neighborhood;
    user.complement = complement;
    user.city = city;
    user.uf = uf;
    user.logradouro = logradouro;
    user.googleId = googleId;
    user.facebookId = facebookId;

    user.confirmationTokenDigits = (
      Math.floor(Math.random() * 999999) + 1
    ).toString();

    if (user.confirmationTokenDigits.length < 6) {
      user.confirmationTokenDigits =
        '0'.repeat(6 - user.confirmationTokenDigits.length) +
        user.confirmationTokenDigits;
    }

    return user;
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.createQueryBuilder()
      .leftJoinAndSelect('User.store', 'store')
      .leftJoinAndSelect('store.avatar', 'avatar')
      .where('User.email = :email', { email })
      .getOne();

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  async changePassword(id: string, password: string) {
    const user = await this.findOne(id);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.recoverToken = null;
    await user.save();
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
