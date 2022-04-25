import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { CreateOrderHistoricDto } from './dto/create-order-historic.dto';
import { UpdateOrderHistoricDto } from './dto/update-order-historic.dto';
import { Repository } from 'typeorm';
export declare class OrderHistoricsService {
    private readonly orderHistoricRepository;
    constructor(orderHistoricRepository: Repository<OrderHistoric>);
    create(createOrderHistoricDto: CreateOrderHistoricDto): OrderHistoric;
    findLastSold(storeId: string, limit?: number, offset?: number): Promise<OrderHistoric[]>;
    income(storeId: string, startDate: Date, endDate: Date, limit?: number, offset?: number): Promise<any>;
    amountSolds(storeId: string, startDate: Date, endDate: Date, limit?: number, offset?: number): Promise<any>;
    saveAll(historics: OrderHistoric[]): Promise<OrderHistoric[]>;
    findOne(id: string): Promise<OrderHistoric>;
    findAll(): string;
    findCustomerHistory(customerId: string, storeId: string): Promise<OrderHistoric[]>;
    findOrderHistoric(orderId: string): Promise<OrderHistoric[]>;
    update(id: number, updateOrderHistoricDto: UpdateOrderHistoricDto): string;
    remove(id: number): string;
}
