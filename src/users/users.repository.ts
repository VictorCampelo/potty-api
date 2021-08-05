import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.enabled = queryDto.enabled === undefined ? true : queryDto.enabled;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, name, enabled, role } = queryDto;
    const query = this.createQueryBuilder('user'); //alias utilizado durante a montagem da query
    query.where('user.enabled = :enabled', { enabled });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    const skp = (queryDto.page - 1) * queryDto.limit;
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.enabled']);

    /* getManyAndCount() retorna dois valores:
     * o primeiro são os usuários encontrados,
     * o segundo o total de dados que satisfazem as condições especificadas,
     * ignorando a paginação */
    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password } = createUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.enabled = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      //E11000 duplicate key error collection
      if (error.code === 11000) {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados: ' + error,
        );
      }
    }
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ email, enabled: true });

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
