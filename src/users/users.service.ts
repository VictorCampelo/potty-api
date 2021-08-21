import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.enum';
import { UpdateUserDto } from './dto/update-users.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private filesService: FilesService,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
    }
  }

  //TODO criar dtos para owner
  async createOwnerUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.OWNER);
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'firstName', 'lastName', 'role', 'id'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async updateUser(updateUserRequestDto: UpdateUserRequestDto): Promise<User> {
    try {
      const id = updateUserRequestDto.id;
      console.log(id);
      let user = await this.findUserById(id);
      console.log(user);
      user = Object.assign(user, updateUserRequestDto.updateUserDto);
      console.log(user);
      if (updateUserRequestDto.file) {
        if (user.files) {
          user.files = [await this.filesService.createWithFile(updateUserRequestDto.file)]
        } else {
          user.files = [
            await this.filesService.createWithFile(updateUserRequestDto.file),
          ];
        }
      }

      return await this.userRepository.save(user);
    } catch (err) {
      throw new NotFoundException('error: ' + err);
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
