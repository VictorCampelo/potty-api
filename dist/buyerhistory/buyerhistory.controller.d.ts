import { BuyerhistoryService } from './buyerhistory.service';
import { CreateBuyerhistoryDto } from './dto/create-buyerhistory.dto';
import { UpdateBuyerhistoryDto } from './dto/update-buyerhistory.dto';
export declare class BuyerhistoryController {
    private readonly buyerhistoryService;
    constructor(buyerhistoryService: BuyerhistoryService);
    create(createBuyerhistoryDto: CreateBuyerhistoryDto): Promise<import("./entities/buyerhistory.entity").BuyerHistory>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBuyerhistoryDto: UpdateBuyerhistoryDto): string;
    remove(id: string): string;
}
