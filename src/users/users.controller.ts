import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { SentryInterceptor } from '../interceptors/sentry.interceptor';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// import { multerOptions } from 'src/configs/multer.config';
@Controller('users')
@UseGuards(AuthGuard(), RolesGuard) //protect all user endpoints
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiTags('admin')
  @Post()
  @Role(UserRole.ADMIN) //only admin user can create other admin user
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @ApiTags('owner')
  @Post()
  async createOwnerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createOwnerUser(createUserDto);
    return {
      user,
      message: 'Dono cadastrado com sucesso',
    };
  }

  @UseInterceptors(SentryInterceptor)
  @ApiOperation({ summary: 'Get a authenticate user informations' })
  @ApiTags('users')
  @Get()
  async getAuthUser(@GetUser() authUser: User): Promise<ReturnUserDto> {
    try {
      const user = await this.usersService.findUserById(authUser.id);
      return {
        user,
        message: 'Usuário encontrado',
      };
    } catch (error) {}
  }

  @ApiTags('admin')
  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @ApiTags('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @Patch(':id')
  @Role(UserRole.ADMIN)
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser({ id, updateUserDto, file });
  }

  @ApiTags('users')
  // ! If api will use extern store service then we should use memoryStorage, but if we dont use that, then use dickStorage !
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @Patch()
  async updateNormalUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file,
    @GetUser() user: User,
  ) {
    try {
      const id = user.id;
      return this.usersService.updateUser({ id, updateUserDto, file });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiTags('admin')
  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @ApiTags('admin')
  @Get()
  @Role(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    const found = await this.usersService.findUsers(query);
    return {
      found,
      message: 'Usuários encontrados',
    };
  }
}
