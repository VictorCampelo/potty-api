import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { randomBytes } from 'crypto';
import { EmailsService } from 'src/emails/emails.service';
import { PlansService } from 'src/plans/plans.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from '../users/user-roles.enum';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/users.repository';
import { StoresService } from './../stores/stores.service';
import { UsersService } from './../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePlanDto } from './dto/change-plan-dto';
import { CreateUserStore } from './dto/create-user-store.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
    private readonly storesService: StoresService,
    private readonly usersService: UsersService,
    private readonly plansService: PlansService,
  ) {}

  async signUp(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const user = await this.userRepository.createUser(createUserDto, role);

      if (
        !(await this.emailsService.sendEmail(
          user.email,
          'Boa de venda - Confirme seu e-mail',
          'email-confirmation',
          {
            token: user.confirmationToken,
          },
        ))
      )
        throw new HttpException(
          'Problema no envio de e-mail',
          HttpStatus.BAD_REQUEST,
        );
      return user;
    }
  }

  async signUpOwner(
    createUserAndStore: CreateUserStore,
    storeAvatar: Express.Multer.File,
  ): Promise<User> {
    const { userDto, storeDto } = createUserAndStore;
    if (userDto.password !== userDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      storeDto['formatedName'] = storeDto.name.replace(/ /g, '-').toLowerCase();

      if (storeAvatar) {
        storeDto.avatar = storeAvatar;
      }

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
      role: user.role,
      storeId: user.store && user.store.id ? user.store.id : null,
    };

    const jwtToken = this.jwtService.sign(jwtPayload);

    return { user, jwtToken };
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
      'Boa de venda - Recuperação de senha',
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

  async changeUserPlan(changePlanDto: ChangePlanDto) {
    const user = await this.userRepository.findOne(changePlanDto.userId);
    const plan = await this.plansService.findOne(changePlanDto.planId);
    user.plan = plan;

    if (!user || !plan) {
      throw new HttpException('User or Plan not found', HttpStatus.NOT_FOUND);
    }

    return user.save();
  }
}
