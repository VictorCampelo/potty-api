import { Store } from 'src/stores/store.entity';
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
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { FilesService } from 'src/files/files.service';
import { getConnection } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private filesService: FilesService,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords dont match');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
    }
  }

  //TODO criar dtos para owner
  async createOwnerUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords dont match');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.OWNER);
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: [
        'email',
        'firstName',
        'lastName',
        'role',
        'id',
        'profileImage',
        'street',
        'addressNumber',
        'neighborhood',
        'complement',
        'city',
        'uf',
        'zipcode',
        'logradouro',
      ],
      relations: ['files', 'plan'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findUserMe(userId: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('User.id = :id', { id: userId })
      .select([
        'User.email',
        'User.firstName',
        'User.lastName',
        'User.role',
        'User.id',
        'User.profileImage',
      ])
      .leftJoinAndSelect('User.files', 'files')
      .leftJoinAndSelect('User.store', 'store')
      .leftJoinAndSelect('store.avatar', 'avatar')
      .leftJoinAndSelect('store.background', 'background')
      .getOne();

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async myStore(userId: string): Promise<Store> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['store'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user.store;
  }

  async updateUser(updateUserRequestDto: UpdateUserRequestDto): Promise<User> {
    let file;
    let user = await this.findUserById(updateUserRequestDto.id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user = Object.assign(user, updateUserRequestDto.updateUserDto);
    if (updateUserRequestDto.file && user) {
      file = await this.filesService.createFiles([updateUserRequestDto.file]);
      user.profileImage = file;
    }
    user = await this.userRepository.save(user);
    await this.filesService.saveFile(file);
    return user;
  }

  async addUserPic(user: User, newProfileImage: Express.Multer.File) {
    const file = await this.filesService.createFiles([newProfileImage]);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    user.profileImage = file[0];
    return this.userRepository.save(user);
  }

  async deleteUserPic(userFileId: string) {
    return this.filesService.remove([userFileId]);
  }

  async updateUserPic(user: User, newProfileImage: Express.Multer.File) {
    await this.filesService.remove([user.profileImage.id]);
    const file = await this.filesService.createFiles([newProfileImage]);
    user.profileImage = file[0];
    return this.userRepository.save(user);
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    return this.userRepository.findUsers(queryDto);
  }

  async updateUserTerms() {
    return getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ hasAcceptedTerms: false })
      .where('role != :role', { role: 'ADMIN' })
      .execute();
  }
}
