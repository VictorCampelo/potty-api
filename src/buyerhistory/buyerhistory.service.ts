import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBuyerhistoryDto } from './dto/create-buyerhistory.dto';
import { UpdateBuyerhistoryDto } from './dto/update-buyerhistory.dto';
import { BuyerHistory } from './entities/buyerhistory.entity';

@Injectable()
export class BuyerhistoryService {
  constructor(
    @InjectRepository(BuyerHistory)
    private readonly buyerhistoryRepository: Repository<BuyerHistory>,
  ) {}
  async create(createBuyerhistoryDto: CreateBuyerhistoryDto) {
    const history = this.buyerhistoryRepository.create(createBuyerhistoryDto);

    return this.buyerhistoryRepository.save(history);
  }

  findAll() {
    return `This action returns all buyerhistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buyerhistory`;
  }

  update(id: number, updateBuyerhistoryDto: UpdateBuyerhistoryDto) {
    return `This action updates a #${id} buyerhistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyerhistory`;
  }
}
