import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { EmailsService } from 'src/emails/emails.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from '../users/user-roles.enum';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/users.repository';
import { StoresService } from './../stores/stores.service';
import { UsersService } from './../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserStore } from './dto/create-user-store.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private emailsService: EmailsService,
    private storesService: StoresService,
    private usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const user = await this.userRepository.createUser(createUserDto, role);
      // await this.emailsService.sendEmail(
      //   user.email,
      //   'Email de confirmação',
      //   'email-confirmation',
      //   {
      //     token: user.confirmationToken,
      //   },
      // );
      return user;
    }
  }

  async signUpOwner(createUserAndStore: CreateUserStore): Promise<User> {
    const { userDto, storeDto } = createUserAndStore;
    if (userDto.password != userDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const store = await this.storesService.create(storeDto);
      const user = await this.usersService.createOwnerUser(userDto);
      user.store = store;
      user.storeId = store.id;
      await user.save();
      return user;
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
    };
    const jwtToken = await this.jwtService.sign(jwtPayload);

    return { jwtToken };
  }

  async confirmEmail(confirmationToken: string) {
    const result = await this.userRepository.update(
      { confirmationToken }, //busca o usuário pelo token
      { confirmationToken: null },
    );
    if (result.affected === 0) throw new NotFoundException('Token inválido');
    return result;
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();
    await this.emailsService.sendEmail(
      user.email,
      'Recuperação de senha',
      'recover-password',
      {
        token: user.recoverToken,
      },
    );
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if (password != passwordConfirmation)
      throw new UnprocessableEntityException('As senhas não conferem');

    await this.userRepository.changePassword(id, password);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { recoverToken },
      {
        select: ['id'],
      },
    );
    if (!user) throw new NotFoundException('Token inválido.');

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
