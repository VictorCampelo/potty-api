import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
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
}
