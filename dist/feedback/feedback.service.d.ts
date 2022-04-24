import { OrdersService } from './../orders/orders.service';
import { Store } from 'src/stores/store.entity';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { FindFeedbackDto } from './dto/find-feedback.dto';
export declare class FeedbackService {
    private feedbackRepository;
    private productService;
    private storesService;
    private ordersService;
    constructor(feedbackRepository: Repository<Feedback>, productService: ProductsService, storesService: StoresService, ordersService: OrdersService);
    create(createFeedbackDto: CreateFeedbackDto, user: User, store: Store): Promise<Feedback>;
    findAllFeedbacksFromStore(storeId: string): Promise<Feedback[]>;
    fromProduct(productId: string, findFeedbackDto: FindFeedbackDto): Promise<Feedback[]>;
    findOne(id: number): string;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): string;
}
