import { OrderHistoric } from 'src/order-historics/entities/order-historic.entity';
import { OrderHistoricRepository } from './order-historics.repository';
import { Injectable } from '@nestjs/common';
import { CreateOrderHistoricDto } from './dto/create-order-historic.dto';
import { UpdateOrderHistoricDto } from './dto/update-order-historic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import camelcaseKeys from 'camelcase-keys';

@Injectable()
export class OrderHistoricsService {
  constructor(
    @InjectRepository(OrderHistoricRepository)
    private readonly orderHistoricRepository: OrderHistoricRepository,
  ) {}
  create(createOrderHistoricDto: CreateOrderHistoricDto) {
    return this.orderHistoricRepository.create(createOrderHistoricDto);
  }

  async findLastSold(storeId: string, limit?: number, offset?: number) {
    return this.orderHistoricRepository.find({
      where: {
        product: {
          storeId,
        },
        order: {
          status: true,
        },
      },
      relations: ['product', 'order'],
      take: limit ? limit : 10,
      skip: offset ? offset : 0,
      order: { createdAt: 'DESC' },
    });
  }

  async income(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    const params: any = [storeId, startDate, endDate];

    let query = `
    select
      date_trunc('week', oh."updatedAt"::date) as weekly,
      sum((oh."productQtd" * oh."productPrice")) as income
    from
      "order-historic" oh
    inner join 
      product p on p.id = oh."productId"
    where 
      p.store_id = $1
    AND
      oh."updatedAt" >= $2 and oh."updatedAt" <= $3
    group by weekly
    `;

    if (offset) {
      params.push(offset);
      query += `offset $${params.length} `;
    }

    if (limit) {
      params.push(limit);
      query += `limit $${params.length} `;
    }

    const products = await getConnection().query(query, params);

    return camelcaseKeys(products);
  }

  async amountSolds(
    storeId: string,
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ) {
    const params: any = [storeId, startDate, endDate];

    let query = `
    select
      "productId",
      sum("productQtd") as qtd,
      p.title
    from
      "order-historic" oh
    inner join (select id, title from product where store_id = $1) as p on
      p.id = oh."productId"
    where
      oh."updatedAt" >= $2 and oh."updatedAt" <= $3
    group by
      "productId",
      p.title 
    `;

    if (offset) {
      params.push(offset);
      query += `offset $${params.length} `;
    }

    if (limit) {
      params.push(limit);
      query += `limit $${params.length} `;
    }

    const products = await getConnection().query(query, params);

    return camelcaseKeys(products);
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
