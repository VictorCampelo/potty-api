import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
    private usersService: UsersService,
  ) {}

  create(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeRepository.createStoreAfterUser(createStoreDto);
  }

  findAll() {
    return `This action returns all stores`;
  }

  async findOne(store_id: string) {
    return await this.storeRepository.findOne({ id: store_id });
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async addLike(userId: string, storeId: string): Promise<Store> {
    const user = await this.usersService.findUserById(userId);
    const store = await this.storeRepository.findOne(storeId);

    //TODO: verificar se o Usuário já deu like

    if (!user || !store) {
      throw new NotFoundException('User or Store not found.');
    }

    return await this.storeRepository.addLike(user, store);
  }
}
