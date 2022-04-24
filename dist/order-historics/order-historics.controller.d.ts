import { OrderHistoricsService } from './order-historics.service';
import { CreateOrderHistoricDto } from './dto/create-order-historic.dto';
import { UpdateOrderHistoricDto } from './dto/update-order-historic.dto';
export declare class OrderHistoricsController {
    private readonly orderHistoricsService;
    constructor(orderHistoricsService: OrderHistoricsService);
    create(createOrderHistoricDto: CreateOrderHistoricDto): import("./entities/order-historic.entity").OrderHistoric;
    findAll(): string;
    findOne(id: string): Promise<import("./entities/order-historic.entity").OrderHistoric>;
    update(id: string, updateOrderHistoricDto: UpdateOrderHistoricDto): string;
    remove(id: string): string;
}
