import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
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
    }

    try {
      const user = await this.userRepository.createUser(createUserDto, role);

      await user.save();

      await this.emailsService.sendEmail(
        user.email,
        'Boa de venda - Confirme seu e-mail',
        'email-confirmation',
        {
          token: user.confirmationToken,
          tokenDigits: user.confirmationTokenDigits,
        },
      );

      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      throw new HttpException(
        `Ocorreu um erro ao cadastrar usuário: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signUpOwner(
    createUserAndStore: CreateUserStore,
    storeAvatar: Express.Multer.File,
  ): Promise<{ user: User; planUrl: string } | User> {
    const { userDto, storeDto } = createUserAndStore;
    if (userDto.password !== userDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }

    try {
      if (!/^[A-Za-z0-9_-]+$/g.test(storeDto.name.replace(/ /g, '-'))) {
        throw new HttpException(
          'Nome da Loja contém caracteres inválidos',
          HttpStatus.BAD_REQUEST,
        );
      }

      storeDto['formatedName'] = storeDto.name.replace(/ /g, '-').toLowerCase();

      if (storeAvatar) {
        storeDto.avatar = storeAvatar;
      }

      const store = await this.storesService.create(storeDto);
      const user = await this.usersService.createOwnerUser(userDto);
      user.store = store;
      user.storeId = store.id;

      await store.save();
      await user.save();

      await this.emailsService.sendEmail(
        user.email,
        'Boa de venda - Confirme seu e-mail',
        'email-confirmation',
        {
          token: user.confirmationToken,
          tokenDigits: user.confirmationTokenDigits,
        },
      );

      delete user.password;
      delete user.salt;

      if (userDto.chosenPlan) {
        const plan = await this.plansService.findByNickname(userDto.chosenPlan);

        return { user, planUrl: plan ? plan.url : 'Plan not found' };
      }

      return user;
    } catch (error) {
      if (
        error.detail &&
        error.detail.includes('Key (email)=(') &&
        error.detail.includes(') already exists.')
      ) {
        error.status = 409;
        error.message = 'Email inserido já tem cadastro';
      }

      throw new HttpException(
        `Ocorreu um erro ao cadastrar lojista: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.enabled) {
      throw new HttpException('Need e-mail activation', HttpStatus.FORBIDDEN);
    }

    const jwtPayload = {
      id: user.id,
      role: user.role,
      storeId: user.store && user.store.id ? user.store.id : null,
    };

    const jwtToken = this.jwtService.sign(jwtPayload);

    return { user, jwtToken };
  }

  async confirmEmail({
    tokenUrl,
    tokenDigits,
  }: {
    tokenUrl: string;
    tokenDigits: string;
  }) {
    if (tokenUrl) {
      const result = await this.userRepository.update(
        { confirmationToken: tokenUrl }, //busca o usuário pelo token
        {
          confirmationToken: null,
          confirmationTokenDigits: null,
          enabled: true,
        },
      );

      if (result.affected === 0) throw new NotFoundException('Token inválido');
      return result;
    } else {
      const result = await this.userRepository.update(
        { confirmationTokenDigits: tokenDigits }, //busca o usuário pelo token
        {
          confirmationToken: null,
          confirmationTokenDigits: null,
          enabled: true,
        },
      );

      if (result.affected === 0) throw new NotFoundException('Token inválido');
      return result;
    }
  }

  async sendEmailConfirmation(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    user.confirmationToken = randomBytes(32).toString('hex');
    user.confirmationTokenDigits = (
      Math.floor(Math.random() * 999999) + 1
    ).toString();

    if (user.confirmationTokenDigits.length < 6) {
      user.confirmationTokenDigits =
        '0'.repeat(6 - user.confirmationTokenDigits.length) +
        user.confirmationTokenDigits;
    }

    await user.save();
    await this.emailsService.sendEmail(
      user.email,
      'Boa de venda - Confirme seu e-mail',
      'email-confirmation',
      {
        token: user.confirmationToken,
        tokenDigits: user.confirmationTokenDigits,
      },
    );
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    user.recoverToken = (Math.floor(Math.random() * 999999) + 1).toString();
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

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const plan = await this.plansService.findOne(changePlanDto.planId);

    if (!plan) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    user.plan = plan;

    return user.save();
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return 'Email available';
    } else {
      throw new HttpException('Email taken', HttpStatus.EXPECTATION_FAILED);
    }
  }

  async socialsLogin(req, service: string) {
    if (!req.user) {
      return `https://www.boadevenda.com.br/404`;
    }

    const whereSocial =
      service === 'google'
        ? {
            googleId: req.user.id,
          }
        : {
            facebookId: req.user.id,
          };

    const user = await this.userRepository.findOne({
      where: whereSocial,
    });

    if (!user) {
      return {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      };
    } else {
      const jwtPayload = {
        id: user.id,
        role: user.role,
        storeId: user.store && user.store.id ? user.store.id : null,
      };

      const jwtToken = this.jwtService.sign(jwtPayload);

      return `https://www.boadevenda.com.br/login?accessToken=${jwtToken}`;
    }
  }
}
