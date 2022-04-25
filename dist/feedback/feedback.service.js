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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const orders_service_1 = require("./../orders/orders.service");
const feedback_entity_1 = require("./feedback.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const products_service_1 = require("../products/products.service");
const stores_service_1 = require("../stores/stores.service");
let FeedbackService = class FeedbackService {
    constructor(feedbackRepository, productService, storesService, ordersService) {
        this.feedbackRepository = feedbackRepository;
        this.productService = productService;
        this.storesService = storesService;
        this.ordersService = ordersService;
    }
    async create(createFeedbackDto, user, store) {
        const orders = await this.ordersService.findAllOrderByUser(user.id, true);
        let product;
        orders.forEach((order) => {
            if (order.id === createFeedbackDto.orderId) {
                order.orderHistorics.forEach((oh) => {
                    if (oh.productId === createFeedbackDto.productId) {
                        product = oh.product;
                        return;
                    }
                });
            }
        });
        if (!product || product.storeId !== store.id) {
            throw new common_1.HttpException('Product not bought by this User', common_1.HttpStatus.BAD_REQUEST);
        }
        const alreadyGaveFeedback = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.product', 'product')
            .where('user.id = :userId', { userId: user.id })
            .andWhere('product.id = :productId', { productId: product.id })
            .andWhere('feedback.orderId = :orderId', {
            orderId: createFeedbackDto.orderId,
        })
            .getOne();
        if (alreadyGaveFeedback)
            throw new common_1.HttpException('You already gave a feedback to this Product.', common_1.HttpStatus.BAD_REQUEST);
        store.sumStars += createFeedbackDto.star;
        store.sumFeedbacks += 1;
        store.avgStars = store.sumStars / store.sumFeedbacks;
        product.sumStars += createFeedbackDto.star;
        product.sumFeedbacks += 1;
        product.avgStars = product.sumStars / product.sumFeedbacks;
        const feedbackToCreate = this.feedbackRepository.create({
            comment: createFeedbackDto.comment,
            star: createFeedbackDto.star,
            orderId: createFeedbackDto.orderId,
            product,
            user,
        });
        await this.productService.saveAll([product]);
        await this.storesService.save(store);
        return this.feedbackRepository.save(feedbackToCreate);
    }
    async findAllFeedbacksFromStore(storeId) {
        const allFeedbacks = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.product', 'product')
            .leftJoinAndSelect('product.store', 'store')
            .where('store.id = :id', { id: storeId })
            .select([
            'feedback.comment',
            'feedback.star',
            'feedback.updatedAt',
            'user.id',
            'user.firstName',
        ])
            .orderBy('feedback.createdAt', 'DESC')
            .getMany();
        if (!allFeedbacks.length) {
            throw new common_1.NotFoundException("The Store doesn't have any feedbacks yet.");
        }
        return allFeedbacks;
    }
    async fromProduct(productId, findFeedbackDto) {
        let orderBy = [];
        switch (findFeedbackDto.order) {
            case 'created':
                orderBy = ['feedback.createdAt', 'DESC'];
                break;
            case 'bestStars':
                orderBy = ['feedback.star', 'DESC'];
                break;
            case 'worseStars':
                orderBy = ['feedback.star', 'ASC'];
                break;
            default:
                orderBy = ['feedback.createdAt', 'DESC'];
                break;
        }
        if (findFeedbackDto.stars) {
            return this.feedbackRepository
                .createQueryBuilder('feedback')
                .leftJoinAndSelect('feedback.user', 'user')
                .leftJoinAndSelect('feedback.product', 'product')
                .where('product.id = :id', { id: productId })
                .andWhere('feedback.star = :star', {
                star: findFeedbackDto.stars,
            })
                .select([
                'feedback.comment',
                'feedback.star',
                'feedback.updatedAt',
                'user.id',
                'user.firstName',
            ])
                .orderBy(orderBy[0], orderBy[1] === 'ASC' ? 'ASC' : 'DESC')
                .getMany();
        }
        return this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.user', 'user')
            .leftJoinAndSelect('feedback.product', 'product')
            .where('product.id = :id', { id: productId })
            .select([
            'feedback.comment',
            'feedback.star',
            'feedback.updatedAt',
            'user.id',
            'user.firstName',
        ])
            .orderBy(orderBy[0], orderBy[1] === 'ASC' ? 'ASC' : 'DESC')
            .getMany();
    }
    findOne(id) {
        return `This action returns a #${id} feedback`;
    }
    async update(id, updateFeedbackDto) {
        return this.feedbackRepository.update(id, updateFeedbackDto);
    }
    remove(id) {
        return `This action removes a #${id} feedback`;
    }
};
FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService,
        stores_service_1.StoresService,
        orders_service_1.OrdersService])
], FeedbackService);
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map