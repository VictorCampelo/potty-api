import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { AddLikeDto } from './dto/add-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const findStoreDto = { store_id: id };
    if (limit && offset) {
      findStoreDto['loadProducts'] = { limit, offset };
    }
    return await this.storesService.findOne(findStoreDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.OWNER)
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }

  @Post('addLike')
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.USER)
  async addLikeToStore(@Body() addLikeDto: AddLikeDto, @GetUser() user: User) {
    // TODO: Pegar o ID do usuário logado
    const store = await this.storesService.addLike(
      user.id,
      addLikeDto.store_id,
    );
    return { store: store, message: 'Sucessfuly added one like to the Store.' };
  }
}
