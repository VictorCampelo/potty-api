import { Repository } from 'typeorm';
import { CreateBuyerhistoryDto } from './dto/create-buyerhistory.dto';
import { UpdateBuyerhistoryDto } from './dto/update-buyerhistory.dto';
import { BuyerHistory } from './entities/buyerhistory.entity';
export declare class BuyerhistoryService {
    private readonly buyerhistoryRepository;
    constructor(buyerhistoryRepository: Repository<BuyerHistory>);
    create(createBuyerhistoryDto: CreateBuyerhistoryDto): Promise<BuyerHistory>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBuyerhistoryDto: UpdateBuyerhistoryDto): string;
    remove(id: number): string;
}
