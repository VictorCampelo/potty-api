import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { AddLikeDto } from './dto/add-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('stores')
@UseGuards(AuthGuard(), RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }

  @Post('addLike')
  // @Role(UserRole.USER)
  async addLikeToStore(@Body() addLikeDto: AddLikeDto, @GetUser() user: User) {
    // TODO: Pegar o ID do usuário logado
    const store = await this.storesService.addLike(
      user.id,
      addLikeDto.store_id,
    );
    return { store: store, message: 'Sucessfuly added one like to the Store.' };
  }
}
