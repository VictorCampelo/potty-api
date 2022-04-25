import { StoresService } from 'src/stores/stores.service';
import { User } from 'src/users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { FindMostSolds } from 'src/dashboard/dto/find-most-solds.dto';
import { findOrdersDto } from './dto/find-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    private readonly storesService;
    constructor(ordersService: OrdersService, storesService: StoresService);
    create(createOrderDto: CreateOrderDto, user: User): Promise<{
        orders: Order[];
        whatsapp: string[];
        message: string;
    }>;
    createGuestOrder(createOrderDto: CreateOrderDto): Promise<{
        orders: Order[];
        whatsapp: string[];
        message: string;
    }>;
    confirmOrder(orderId: string, user: User): Promise<Order>;
    findAll(query: findOrdersDto, user: User): Promise<{
        results: any;
        totalOrders: number;
    }>;
    findOneToStore(id: string, user: User): Promise<Order>;
    update(updateOrderDto: UpdateOrderDto): Promise<import("typeorm").UpdateResult>;
    findAllOrdersByUser(user: User, query: FindMostSolds): Promise<Order[]>;
    findOneToUser(id: string, user: User): Promise<Order>;
}
