import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ErrorHandling } from 'src/configs/error-handling';
import { UserRole } from 'src/users/user-roles.enum';
import { StoresService } from '../stores/stores.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserStore } from './dto/create-user-store.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup-store')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserStore })
  async createUserAndStore(
    @Body(ValidationPipe) createUserAndStore: CreateUserStore,
  ) {
    try {
      const user = await this.authService.signUpOwner(createUserAndStore);
      return { user: user, message: 'User and Store createds.' };
    } catch (error) {
      return new ErrorHandling(error);
    }
  }

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.signUp(createUserDto, UserRole.USER);
      return {
        message: 'Cadastro realizado com sucesso',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ jwtToken: string }> {
    try {
      return await this.authService.signIn(credentiaslsDto);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Patch(':token')
  async confirmEmail(@Param('token') token: string) {
    try {
      if (await this.authService.confirmEmail(token)) {
        return {
          message: 'Email confirmado',
        };
      }
      return {
        message: 'Erro ao confirmar o seu E-mail',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    try {
      await this.authService.sendRecoverPasswordEmail(email);
      return {
        message: 'Foi enviado um email com instruções para resetar sua senha',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.resetPassword(token, changePasswordDto);

      return {
        message: 'Senha alterada com sucesso',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    try {
      if (user.role !== UserRole.ADMIN && user.id.toString() !== id)
        throw new UnauthorizedException(
          'Você não tem permissão para realizar esta operação',
        );

      await this.authService.changePassword(id, changePasswordDto);
      return {
        message: 'Senha alterada',
      };
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    try {
      return user;
    } catch (error) {
      new ErrorHandling(error);
    }
  }
}
