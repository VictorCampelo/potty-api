import { OrderHistoricsService } from './../order-historics/order-historics.service';
import { StoresService } from 'src/stores/stores.service';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { CouponsService } from 'src/coupons/coupons.service';
import { UsersService } from 'src/users/users.service';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly productService;
    private readonly storesService;
    private readonly couponsService;
    private readonly historicsService;
    private readonly usersService;
    constructor(orderRepository: Repository<Order>, productService: ProductsService, storesService: StoresService, couponsService: CouponsService, historicsService: OrderHistoricsService, usersService: UsersService);
    create(createOrderDto: CreateOrderDto, user?: User): Promise<{
        orders: Order[];
        messages: string[];
    }>;
    private applyCouponDiscountBasedOnType;
    private createWhatsappMessage;
    fillAllOrderByStatus(storeId: string, limit?: number, offset?: number): Promise<{
        results: any;
        totalOrders: number;
    }>;
    confirmOrder(orderId: string, storeId: string): Promise<Order>;
    findOneToUser(id: string, userId: string): Promise<Order>;
    findOneToStore(id: string, storeId: string): Promise<Order>;
    findAllOrderByUser(userId: string, confirmed: boolean, limit?: number, offset?: number): Promise<Order[]>;
    updateOrderSituation(updateOrderDto: UpdateOrderDto): Promise<import("typeorm").UpdateResult>;
}
