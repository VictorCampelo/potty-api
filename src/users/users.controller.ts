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

/**
 * Posts users controller
 * Get user controller
 * Patch user controller
 * Deletes users controller
 * Gets users controller
 */
@Controller('users')
@UseGuards(AuthGuard(), RolesGuard) //protect all user endpoints
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Posts users controller
   * @param createUserDto
   * @returns admin user
   */
  @Post()
  @Role(UserRole.ADMIN) //somente admin pode criar admin
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  /**
   * Posts users controller
   * @param createUserDto
   * @returns admin user
   */
  @Post()
  @Role(UserRole.OWNER) //somente admin pode criar admin
  async createOwnerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Dono cadastrado com sucesso',
    };
  }

  /**
   * Get user controller
   * @param id
   * @returns user by id
   */
  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  /**
   * Patch user controller with admin role
   * @param updateUserDto
   * @param user
   * @param id
   * @returns user
   */
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

  /**
   * Patch normal user controller
   * @param updateUserDto
   * @param user
   * @returns
   */
  @Patch()
  async updateNormalUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.usersService.updateUser(updateUserDto, user.id);
  }

  /**
   * Deletes users controller
   * @param id
   * @returns {string} message
   */
  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  /**
   * Gets users controller
   * @param query
   * @returns list of user
   */
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
