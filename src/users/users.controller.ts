import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpResponseDto } from 'src/configs/http-response.dto';

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

  @ApiTags('users')
  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @ApiTags('users')
  @Patch()
  async updateNormalUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.updateUser(updateUserDto, user.id);
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
