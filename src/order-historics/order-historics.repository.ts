import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrderHistoric)
export class OrderHistoricRepository extends Repository<OrderHistoric> {}
