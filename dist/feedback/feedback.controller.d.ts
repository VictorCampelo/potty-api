import { ProductsService } from 'src/products/products.service';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/users/user.entity';
import { StoresService } from 'src/stores/stores.service';
import { FindFeedbackDto } from './dto/find-feedback.dto';
export declare class FeedbackController {
    private readonly feedbackService;
    private readonly storesService;
    private readonly productsService;
    constructor(feedbackService: FeedbackService, storesService: StoresService, productsService: ProductsService);
    create(user: User, createFeedbackDto: CreateFeedbackDto, storeId: string): Promise<import("./feedback.entity").Feedback>;
    findAllFeedbacksFromStore(storeId: string): Promise<import("./feedback.entity").Feedback[]>;
    fromProduct(productId: string, findFeedbackDto: FindFeedbackDto): Promise<import("./feedback.entity").Feedback[]>;
    findOne(id: string): Promise<string>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): string;
}
