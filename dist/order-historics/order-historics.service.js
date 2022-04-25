"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoricsService = void 0;
const order_historic_entity_1 = require("./entities/order-historic.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
let OrderHistoricsService = class OrderHistoricsService {
    constructor(orderHistoricRepository) {
        this.orderHistoricRepository = orderHistoricRepository;
    }
    create(createOrderHistoricDto) {
        return this.orderHistoricRepository.create(createOrderHistoricDto);
    }
    async findLastSold(storeId, limit, offset) {
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
    async income(storeId, startDate, endDate, limit, offset) {
        const params = [storeId, startDate, endDate];
        let query = `
    select
      date_trunc('week', oh."updatedAt"::date) as weekly,
      sum((oh."productQtd" * oh."productPrice")) as income
    from
      "order_historic" oh
    inner join 
      product p on p.id = oh."product_id"
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
        const products = await (0, typeorm_2.getConnection)().query(query, params);
        return (0, camelcase_keys_1.default)(products);
    }
    async amountSolds(storeId, startDate, endDate, limit, offset) {
        const params = [storeId, startDate, endDate];
        let query = `
    select
      "product_id",
      sum("productQtd") as qtd,
      p.title
    from
      "order_historic" oh
    inner join (select id, title from product where store_id = $1) as p on
      p.id = oh."product_id"
    where
      oh."updatedAt" >= $2 and oh."updatedAt" <= $3
    group by
      "product_id",
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
        const products = await (0, typeorm_2.getConnection)().query(query, params);
        return (0, camelcase_keys_1.default)(products);
    }
    async saveAll(historics) {
        return this.orderHistoricRepository.save(historics);
    }
    async findOne(id) {
        return this.orderHistoricRepository.findOne(id);
    }
    findAll() {
        return `This action returns all orderHistorics`;
    }
    async findCustomerHistory(customerId, storeId) {
        return this.orderHistoricRepository.find({
            where: {
                customerId,
                storeId,
            },
        });
    }
    async findOrderHistoric(orderId) {
        return this.orderHistoricRepository.find({ where: { orderId } });
    }
    update(id, updateOrderHistoricDto) {
        return `This action updates a #${id} orderHistoric`;
    }
    remove(id) {
        return `This action removes a #${id} orderHistoric`;
    }
};
OrderHistoricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_historic_entity_1.OrderHistoric)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderHistoricsService);
exports.OrderHistoricsService = OrderHistoricsService;
//# sourceMappingURL=order-historics.service.js.map