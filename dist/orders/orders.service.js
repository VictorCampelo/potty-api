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
exports.OrdersService = void 0;
const order_historics_service_1 = require("./../order-historics/order-historics.service");
const stores_service_1 = require("../stores/stores.service");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("../products/products.service");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const uuid_1 = require("uuid");
const coupons_service_1 = require("../coupons/coupons.service");
const users_service_1 = require("../users/users.service");
const scheduleProperties_interface_1 = require("../stores/types/scheduleProperties.interface");
let OrdersService = class OrdersService {
    constructor(orderRepository, productService, storesService, couponsService, historicsService, usersService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.storesService = storesService;
        this.couponsService = couponsService;
        this.historicsService = historicsService;
        this.usersService = usersService;
    }
    async create(createOrderDto, user) {
        const queryRunner = (0, typeorm_2.getConnection)().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const messages = [];
            const historics = [];
            const orders = [];
            const productsToSave = [];
            let userInfo;
            if (user) {
                userInfo = await this.usersService.findUserById(user.id);
            }
            else {
                userInfo = {
                    firstName: '',
                    lastName: '',
                    uf: '',
                    city: '',
                    street: '',
                    zipcode: '',
                    neighborhood: '',
                    addressNumber: 0,
                    complement: '',
                };
                let keys = [
                    'firstName',
                    'lastName',
                    'uf',
                    'city',
                    'street',
                    'zipcode',
                    'neighborhood',
                    'addressNumber',
                    'complement',
                ];
                keys.forEach((key) => {
                    console.log(createOrderDto.guestAddress);
                    if (createOrderDto.guestAddress[key]) {
                        userInfo[key] = createOrderDto.guestAddress[key];
                    }
                });
            }
            const stores = await this.storesService.findAllByIds(createOrderDto.products.map((prod) => prod.storeId));
            let coupon;
            let couponWasUsed;
            if (createOrderDto?.couponCode) {
                coupon = await this.couponsService.findOne(createOrderDto?.couponCode);
                if (!coupon) {
                    throw new common_1.HttpException('Coupon not found', common_1.HttpStatus.NOT_FOUND);
                }
                if (coupon.range === 'first-buy' && !user) {
                    throw new common_1.HttpException('Invalid Coupon', common_1.HttpStatus.BAD_REQUEST);
                }
                if (!(await this.couponsService.checkCoupom(coupon.code, coupon.storeId))) {
                    throw new common_1.HttpException('Invalid Coupon', common_1.HttpStatus.BAD_REQUEST);
                }
                if (coupon.maxUsage <= 0) {
                    throw new common_1.HttpException('Coupon exceeded maximum usage', common_1.HttpStatus.BAD_REQUEST);
                }
                if ((coupon.validate && new Date() > coupon.validate) ||
                    coupon.isExpired) {
                    throw new common_1.HttpException(`Coupon expired`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            for (const storeOrder of createOrderDto.products) {
                const store = stores.find((obj) => obj.id === storeOrder.storeId);
                if (storeOrder.delivery) {
                    console.log('User Info >>> ', userInfo);
                    if (!userInfo.zipcode ||
                        !userInfo.city ||
                        !userInfo.street ||
                        !userInfo.neighborhood ||
                        !userInfo.addressNumber) {
                        throw new common_1.HttpException('Missing some address information from Customer: zipcode, city, neighborhood, street or addressNumber', common_1.HttpStatus.BAD_REQUEST);
                    }
                    if (store.dispatch !== scheduleProperties_interface_1.DispatchTypes.DELIVERY &&
                        store.dispatch !== scheduleProperties_interface_1.DispatchTypes.ALL) {
                        throw new common_1.HttpException(`Store '${store.name}' does NOT work with Delivery.`, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                else {
                    if (store.dispatch !== scheduleProperties_interface_1.DispatchTypes.WITHDRAWAL &&
                        store.dispatch !== scheduleProperties_interface_1.DispatchTypes.ALL) {
                        throw new common_1.HttpException(`Store '${store.name}' ONLY works with Delivery.`, common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                let acceptedPayments = [];
                let paymentInput = null;
                store.paymentMethods &&
                    store.paymentMethods.forEach((pm) => {
                        if (!acceptedPayments)
                            acceptedPayments = [pm.id];
                        else
                            acceptedPayments.push(pm.id);
                    });
                createOrderDto.products.forEach((storeProducts) => {
                    if (storeProducts.storeId === store.id) {
                        storeProducts.orderProducts.forEach((orderHistoric) => {
                            if (!acceptedPayments.includes(orderHistoric.paymentMethod)) {
                                throw new common_1.HttpException(`Store ${store.name} does not accept ${orderHistoric.paymentMethod} as a payment method`, common_1.HttpStatus.BAD_REQUEST);
                            }
                            console.log(store.paymentMethods, orderHistoric);
                            paymentInput = store.paymentMethods.find((method) => method.id === orderHistoric.paymentMethod);
                            if (!paymentInput) {
                                throw new common_1.HttpException(`Payment Method not found for this store`, common_1.HttpStatus.BAD_REQUEST);
                            }
                            if (orderHistoric.parcels && !paymentInput?.allowParcels) {
                                throw new common_1.HttpException(`Method ${paymentInput.methodName.toUpperCase()} doesnt accept parcels`, common_1.HttpStatus.BAD_REQUEST);
                            }
                        });
                    }
                });
                const order = this.orderRepository.create({
                    id: (0, uuid_1.v4)(),
                    store,
                    user,
                    status: false,
                    couponId: coupon && coupon.id,
                    requiresDelivery: storeOrder.delivery,
                    customerAddress: `${userInfo.street}, ${userInfo.addressNumber} - ${userInfo.neighborhood}, ${userInfo.city} - ${userInfo.uf}, ${userInfo.zipcode}. ${userInfo.complement ? `Complemento: ${userInfo.complement}.` : ''} ${userInfo.street ? `Logradouro: ${userInfo.street}` : ''}`,
                    situation: 'Recebido',
                });
                let sumAmount = 0;
                const productsListToMsg = [];
                const products = await this.productService.findProductstByIdsAndStoreId(storeOrder.orderProducts.map((prod) => prod.productId), store.id);
                for (const prod of storeOrder.orderProducts) {
                    console.log("PROD", prod);
                    const product = products.find((obj) => obj.id === prod.productId);
                    if (!product) {
                        throw new common_1.HttpException(`Product not found`, common_1.HttpStatus.NOT_FOUND);
                    }
                    if (prod.amount > product.inventory) {
                        throw new common_1.HttpException(`There aren't enough '${product.title}'.`, common_1.HttpStatus.FORBIDDEN);
                    }
                    if (prod.parcels > product.parcelAmount) {
                        throw new common_1.HttpException(`Maximum parcels allowed on product '${product.title}' is ${product.parcelAmount}. You're trying ${prod.parcels}.`, common_1.HttpStatus.FORBIDDEN);
                    }
                    product.sumOrders += prod.amount;
                    product.lastSold = new Date();
                    productsToSave.push(product);
                    store.sumOrders += prod.amount;
                    const history = this.historicsService.create({
                        storeId: storeOrder.storeId,
                        productId: product.id,
                        orderId: order.id,
                        productQtd: prod.amount,
                        productPrice: product.price,
                        productParcels: prod.parcels,
                        paymentMethod: prod.paymentMethod,
                        customerId: user?.id ?? 'GUEST',
                    });
                    sumAmount +=
                        prod.amount *
                            (product.discount
                                ? product.price - product.price * (product.discount / 100)
                                : product.price);
                    if (coupon && coupon.storeId === storeOrder.storeId) {
                        if (coupon.range === 'category') {
                            if (product.categories &&
                                product.categories.some((category) => coupon.categories.filter((c) => c.id === category.id)
                                    .length)) {
                                sumAmount = this.applyCouponDiscountBasedOnType(coupon.type, sumAmount, coupon.discountValue, coupon.discountPorcent, prod.amount *
                                    (product.discount
                                        ? product.price * (product.discount / 100)
                                        : product.price));
                                couponWasUsed = true;
                            }
                            else {
                                throw new common_1.HttpException(`Product '${product.title}' doesn't belong to any category allowed by coupon '${coupon.code}'`, common_1.HttpStatus.BAD_REQUEST);
                            }
                        }
                        else if (coupon.range === 'store') {
                            sumAmount = this.applyCouponDiscountBasedOnType(coupon.type, sumAmount, coupon.discountValue, coupon.discountPorcent, prod.amount *
                                (product.discount
                                    ? product.price * (product.discount / 100)
                                    : product.price));
                            couponWasUsed = true;
                        }
                        else if (coupon.range === 'first-buy') {
                            if (!user.id)
                                throw new common_1.HttpException('Invalid Coupon', common_1.HttpStatus.BAD_REQUEST);
                            const userHistory = await this.historicsService.findCustomerHistory(user.id, storeOrder.storeId);
                            if (!userHistory.length) {
                                sumAmount = this.applyCouponDiscountBasedOnType(coupon.type, sumAmount, coupon.discountValue, coupon.discountPorcent, prod.amount *
                                    (product.discount
                                        ? product.price * (product.discount / 100)
                                        : product.price));
                                couponWasUsed = true;
                            }
                            else {
                                throw new common_1.HttpException(`The Coupon '${coupon.code}' cannot be applied on Product '${product.title}' because it's not your first buy`, common_1.HttpStatus.BAD_REQUEST);
                            }
                        }
                    }
                    productsListToMsg.push({
                        amount: prod.amount,
                        title: product.title,
                        parcels: prod.parcels,
                        paymentMethod: paymentInput.methodName,
                    });
                    order.amount = sumAmount;
                    historics.push(history);
                }
                messages.push(this.createWhatsappMessage(userInfo, productsListToMsg, sumAmount, store, storeOrder.delivery));
                orders.push(order);
            }
            if (couponWasUsed) {
                await this.couponsService.decreaseUsedCoupon(coupon);
            }
            await this.productService.saveProducts(productsToSave);
            await this.orderRepository.save(orders);
            await this.historicsService.saveAll(historics);
            await this.storesService.saveAll(stores);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return { orders, messages };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw error;
        }
    }
    applyCouponDiscountBasedOnType(discountType, currentSumAmount, discountValue, discountPorcent, productPrice) {
        if (discountType !== 'money' && discountType !== 'percentage') {
            throw new common_1.HttpException('Invalid discount type (must be money or percentage).', common_1.HttpStatus.BAD_REQUEST);
        }
        if (discountType === 'money') {
            return (currentSumAmount -= discountValue);
        }
        return (currentSumAmount -= productPrice * discountPorcent);
    }
    createWhatsappMessage(user, productsListToMsg, sumAmount, store, delivery) {
        console.log(productsListToMsg);
        const formatedAmount = sumAmount.toFixed(2).toString().replace('.', ',');
        const paymentMethod = `${productsListToMsg.map((p) => {
            if (p.parcels > 1) {
                return ('%0a - ' +
                    p.paymentMethod.toUpperCase() +
                    " - '" +
                    p.title +
                    "' parcelado em " +
                    p.parcels +
                    ' vezes');
            }
            else {
                return '%0a - ' + p.paymentMethod.toUpperCase() + " '" + p.title + "'";
            }
        })}`;
        const text = `🛍️ *Novo pedido!* 🛍️%0a%0a*Nome do Cliente:* ${user?.firstName ?? 'CONVIDADO'} ${user?.lastName ?? ''}%0a%0a*Itens do Pedido:*%0a${productsListToMsg
            .map((p) => {
            return '  🏷️ ' + p.amount + 'x ' + p.title + '%0a';
        })
            .join('')}%0a*Total do Pedido:* R$ ${formatedAmount}%0a*Forma de Envio:* ${delivery ? 'Entrega' : 'Retirada em loja'}%0a${delivery
            ? `*Custo do Envio:* ${store.deliveryFee
                ? `${'R$ ' +
                    store.deliveryFee.toFixed(2).toString().replace('.', ',')} `
                : 'Taxa de envio não cadastrada'}%0a`
            : '%0a'}*Forma de pagamento:*${paymentMethod}%0a%0a*Endereço do Cliente:*${user.street ? `%0a*Logradouro:*  ${user.street}` : ''}%0a*Número:* ${user.addressNumber}%0a*Bairro:* ${user.neighborhood}%0a*Cidade:* ${user.city} - ${user.uf}${user.complement ? `%0a*Complemento:* ${user.complement}%0a` : ''}`;
        return `https://api.whatsapp.com/send?phone=55${store.phone}&text=${text}`;
    }
    async fillAllOrderByStatus(storeId, limit, offset) {
        if (!limit) {
            limit = 10;
        }
        if (!offset) {
            offset = 0;
        }
        const query = await (0, typeorm_2.getManager)().query(`
      select
	      o.*,
	      oh.product_qtd::integer
      from
	      "order" o
      left join 
        (select
		        sum(oh2."productQtd") as product_qtd,
		        oh2."order_id"
	        from
		        order_historic oh2
	        group by
		        oh2."order_id") as oh
      on 
	      oh."order_id" = o.id
      where
	      o.store_id = $1
      order by
          "createdAt" DESC
      limit $2
      offset $3

    `, [storeId, limit, offset]);
        const total = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.store', 'store')
            .where('store.id = :storeId', { storeId })
            .getCount();
        return { results: query, totalOrders: total };
    }
    async confirmOrder(orderId, storeId) {
        const order = await this.orderRepository.findOne(orderId, {
            where: {
                storeId,
                status: false,
            },
            relations: ['orderHistorics', 'orderHistorics.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order not found`);
        }
        const products = [];
        order.orderHistorics.forEach((history) => {
            history.product.inventory -= history.productQtd;
            products.push(history.product);
        });
        order.status = true;
        await this.productService.saveAll(products);
        return this.orderRepository.save(order);
    }
    findOneToUser(id, userId) {
        return this.orderRepository.findOne(id, {
            where: {
                userId,
            },
            relations: ['orderHistorics', 'orderHistorics.product'],
        });
    }
    async findOneToStore(id, storeId) {
        return this.orderRepository.findOne(id, {
            where: {
                storeId,
            },
            relations: [
                'orderHistorics',
                'orderHistorics.product',
                'orderHistorics.product.files',
            ],
        });
    }
    async findAllOrderByUser(userId, confirmed, limit, offset) {
        return this.orderRepository.find({
            where: {
                userId,
                status: confirmed,
            },
            relations: ['orderHistorics', 'orderHistorics.product'],
            take: limit ? limit : 10,
            skip: offset ? offset : 0,
            order: { createdAt: 'DESC' },
        });
    }
    async updateOrderSituation(updateOrderDto) {
        const confirm = updateOrderDto.situation !== 'Cancelado' &&
            updateOrderDto.situation !== 'Recebido';
        return this.orderRepository.update({
            id: updateOrderDto.orderId,
        }, {
            situation: updateOrderDto.situation,
            status: confirm,
        });
    }
};
OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService,
        stores_service_1.StoresService,
        coupons_service_1.CouponsService,
        order_historics_service_1.OrderHistoricsService,
        users_service_1.UsersService])
], OrdersService);
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map