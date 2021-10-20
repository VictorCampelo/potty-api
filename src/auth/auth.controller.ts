import { CreateUserStore } from './dto/create-user-store.dto';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Param,
  Patch,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { memoryStorage } from 'multer';
import { User } from '../users/user.entity';
import { GetUser } from './get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from 'src/users/user-roles.enum';

import { StoresService } from '../stores/stores.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private storesService: StoresService,
  ) {}

  @Post('/signup-store')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserStore })
  async createUserAndStore(
    @Body(ValidationPipe) createUserAndStore: CreateUserStore,
  ) {
    const user = await this.authService.signUpOwner(createUserAndStore);

    return { user: user, message: 'User and Store createds.' };
  }

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(createUserDto, UserRole.USER);
    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ jwtToken: string }> {
    return await this.authService.signIn(credentiaslsDto);
  }

  @Patch(':token')
  async confirmEmail(@Param('token') token: string) {
    if (await this.authService.confirmEmail(token)) {
      return {
        message: 'Email confirmado',
      };
    }
    return {
      message: 'Erro ao confirmar o seu E-mail',
    };
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoverPasswordEmail(email);
    return {
      message: 'Foi enviado um email com instruções para resetar sua senha',
    };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDto);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    if (user.role !== UserRole.ADMIN && user.id.toString() !== id)
      throw new UnauthorizedException(
        'Você não tem permissão para realizar esta operação',
      );

    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'Senha alterada',
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
