import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
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

import { multerOptions } from 'src/configs/multer.config';
import { Role } from './role.decorator';
import { ChangePlanDto } from './dto/change-plan-dto';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  @Post('/signup-store')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserStore })
  async createUserAndStore(
    @UploadedFile() storeAvatar: Express.Multer.File,
    @Body(ValidationPipe) createUserAndStore: CreateUserStore,
  ) {
    const { storeDto, userDto } = JSON.parse(
      JSON.stringify(createUserAndStore),
    );
    try {
      const user = await this.authService.signUpOwner(
        {
          storeDto: JSON.parse(storeDto as any),
          userDto: JSON.parse(userDto as any),
        },
        storeAvatar,
      );
      return { user: user, message: 'User and Store createds.' };
    } catch (error) {
      if (
        error.detail &&
        error.detail.includes('Key (name)=(') &&
        error.detail.includes(') already exists.')
      ) {
        error.status = 409;
        error.message = 'Store name is currently taken.';
      }

      throw new ErrorHandling(error);
    }
  }

  @Post('/signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      await this.authService.signUp(createUserDto, UserRole.USER);
      return {
        message: 'Cadastro realizado com sucesso',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ jwtToken: string }> {
    try {
      return await this.authService.signIn(credentiaslsDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch('/token')
  async confirmEmail(
    @Query() activateEmailQuery: { tokenUrl: string; tokenDigits: string },
  ) {
    try {
      if (await this.authService.confirmEmail(activateEmailQuery)) {
        return {
          message: 'Email confirmado',
        };
      }
      return {
        message: 'Erro ao confirmar o seu E-mail',
      };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('/send-confirmation-email')
  async sendEmailConfirmation(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    try {
      await this.authService.sendEmailConfirmation(email);
      return {
        message:
          'Foi enviado um email com instruções para ativação da sua conta',
      };
    } catch (error) {
      throw new ErrorHandling(error);
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
      throw new ErrorHandling(error);
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
      throw new ErrorHandling(error);
    }
  }

  @Patch('/change-password/:id')
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
      throw new ErrorHandling(error);
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    try {
      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('/checkEmail')
  @HttpCode(200)
  async checkEmail(@Body() emailDto: { email: string }) {
    try {
      return { message: await this.authService.findByEmail(emailDto.email) };
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch('/plan')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async changeUserPlan(@Body() changePlanDto: ChangePlanDto) {
    try {
      return await this.authService.changeUserPlan(changePlanDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  // @UseInterceptors(FileInterceptor('storeAvatar'))
  // @Post('/filetest')
  // async sendFileTest(@UploadedFile() storeAvatar: Express.Multer.File) {
  //   const { originalname } = storeAvatar;

  //   return await this.authService.uploadS3(
  //     storeAvatar.buffer,
  //     'bdv-dev',
  //     originalname,
  //   );
  // }
}
