import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { OrderHistoricRepository } from './order-historics.repository';
import { Injectable } from '@nestjs/common';
import { CreateOrderHistoricDto } from './dto/create-order-historic.dto';
import { UpdateOrderHistoricDto } from './dto/update-order-historic.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderHistoricsService {
  constructor(
    @InjectRepository(OrderHistoricRepository)
    private readonly orderHistoricRepository: OrderHistoricRepository,
  ) {}
  create(createOrderHistoricDto: CreateOrderHistoricDto) {
    return this.orderHistoricRepository.create(createOrderHistoricDto);
  }

  findLastSold(storeId: string, limit?: number, offset?: number) {
    return this.orderHistoricRepository.find({
      select: ['product'],
      relations: ['product', 'order'],
      where: {
        product: {
          store: storeId,
        },
        order: {
          status: true,
        },
      },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  income(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    return this.orderHistoricRepository
      .createQueryBuilder('order-historic')
      .select(
        `date_trunc('week', "order-historic"."updatedAt"::date) as weekly`,
      )
      .addSelect('product_qtd * product_price', 'income')
      .groupBy('weekly')
      .orderBy('weekly', 'ASC')
      .leftJoin('order-historic.order', 'order', 'order.store_id = :id', {
        id: storeId,
      })
      .where('updatedAt between :start and :end', {
        start: startDate,
        end: endDate,
      })
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async saveAll(historics: OrderHistoric[]) {
    return this.orderHistoricRepository.save(historics);
  }

  findAll() {
    return `This action returns all orderHistorics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderHistoric`;
  }

  update(id: number, updateOrderHistoricDto: UpdateOrderHistoricDto) {
    return `This action updates a #${id} orderHistoric`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderHistoric`;
  }
}
