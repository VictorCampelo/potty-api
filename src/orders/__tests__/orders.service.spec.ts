import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CouponsService } from 'src/coupons/coupons.service';
import { OrderHistoricsService } from 'src/order-historics/order-historics.service';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { createConnections, getConnection } from 'typeorm';
import { Order } from '../order.entity';
import { OrdersService } from '../orders.service';
import Util, { CouponDiscountType, CouponRange } from './util/util';

jest.setTimeout(10000);

describe('OrdersService', () => {
  let ordersService: OrdersService;

  const OrdersMockedRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const ProductsMockedService = {
    findProductstByIdsAndStoreId: jest.fn(),
    saveProducts: jest.fn(),
    saveAll: jest.fn(),
  };

  const StoresMockedService = {
    findAllByIds: jest.fn(),
    saveAll: jest.fn(),
  };

  const CouponsMockedService = {
    findOne: jest.fn(),
    checkCoupom: jest.fn(),
    decreaseUsedCoupon: jest.fn(),
  };

  const OrdersHistoricsMockedService = {
    create: jest.fn(),
    findCustomerHistory: jest.fn(),
    saveAll: jest.fn(),
  };

  const UsersMockedService = {
    findUserById: jest.fn(),
  };

  beforeAll(async () => {
    await createConnections();
  });

  afterAll(async () => {
    const defaultConnection = getConnection('default');
    await defaultConnection.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: OrdersMockedRepository,
        },
        {
          provide: ProductsService,
          useValue: ProductsMockedService,
        },
        {
          provide: StoresService,
          useValue: StoresMockedService,
        },
        {
          provide: CouponsService,
          useValue: CouponsMockedService,
        },
        {
          provide: OrderHistoricsService,
          useValue: OrdersHistoricsMockedService,
        },
        {
          provide: UsersService,
          useValue: UsersMockedService,
        },
      ],
    }).compile();
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('create order', () => {
    /* --- global mocks */
    OrdersMockedRepository.create
      // .mockReturnValue(Util.giveMeAValidCreatedOrder('1'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('1'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('2'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('3'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('4'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('5'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('6'))
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('7'));
    UsersMockedService.findUserById.mockReturnValue(Util.giveMeAValidUser());
    /* global mocks --- */
    it('should create a simple order', async () => {
      /* --- mocks */
      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        Util.giveMeAValidProduct('1', '1', 10, 15, 'Cadeira'),
        Util.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]);
      StoresMockedService.findAllByIds.mockReturnValue([
        Util.giveMeAValidStore('1', '86981834269'),
      ]);
      /* mocks --- */

      /* - main test - */

      const createOrder = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload(),
        Util.giveMeAValidUser(),
      );

      /* - main test - */

      expect(createOrder).toMatchObject({
        orders: [{ amount: 30, id: '1' }],
      });
    });

    it('should creater order with discount', async () => {
      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        Util.giveMeAValidProduct('3', '1', 10, 15, 'Geladeira', 20),
        Util.giveMeAValidProduct('4', '2', 10, 15, 'Cafeteira', 80),
      ]);
      StoresMockedService.findAllByIds.mockReturnValue([
        Util.giveMeAValidStore('1', '86981834269'),
        Util.giveMeAValidStore('2', '86981818181'),
      ]);

      const createOrder = await ordersService.create(
        Util.giveMeAValidCreateOrderWithDiscountPayload(),
        Util.giveMeAValidUser(),
      );

      expect(createOrder).toMatchObject({
        orders: [
          { id: '2', amount: 24 },
          { id: '3', amount: 4 },
        ],
      });
    });

    it('should make an order using coupon', async () => {
      const cupom = Util.giveMeAValidCoupon('cupom', false, 100, '1');
      const cupom2 = Util.giveMeAValidCoupon(
        'cupom2',
        false,
        100,
        '1',
        CouponRange.store,
        ['1'],
        CouponDiscountType.money,
        15,
      );
      const cupom3 = Util.giveMeAValidCoupon(
        'cupom3',
        false,
        100,
        '1',
        CouponRange.first_buy,
        ['1'],
        CouponDiscountType.money,
        10,
      );
      const cupom4 = Util.giveMeAValidCoupon(
        'cupom3',
        false,
        100,
        '1',
        CouponRange.first_buy,
        ['1'],
        CouponDiscountType.percentage,
        90,
      );

      CouponsMockedService.findOne
        .mockReturnValueOnce(cupom)
        .mockReturnValueOnce(cupom2)
        .mockReturnValueOnce(cupom3)
        .mockReturnValueOnce(cupom4);

      CouponsMockedService.checkCoupom
        .mockReturnValueOnce(cupom)
        .mockReturnValueOnce(cupom2)
        .mockReturnValueOnce(cupom3)
        .mockReturnValueOnce(cupom4);

      OrdersHistoricsMockedService.findCustomerHistory.mockReturnValue(false);

      StoresMockedService.findAllByIds.mockReturnValue([
        Util.giveMeAValidStore('1', '86981834269'),
        Util.giveMeAValidStore('2', '86981818181'),
      ]);

      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        Util.giveMeAValidProduct('1', '1', 10, 15, 'Cadeira'),
        Util.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]);

      const createOrder = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload('cupom'),
        Util.giveMeAValidUser(),
      );

      expect(createOrder).toMatchObject({ orders: [{ id: '4', amount: 25 }] });

      const createOrderWithCouponForStore = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload('cupom2'),
        Util.giveMeAValidUser(),
      );

      expect(createOrderWithCouponForStore).toMatchObject({
        orders: [{ id: '5', amount: 15 }],
      });

      const createOrderWithCouponForFirstBuy = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload('cupom3'),
        Util.giveMeAValidUser(),
      );

      expect(createOrderWithCouponForFirstBuy).toMatchObject({
        orders: [{ id: '6', amount: 20 }],
      });

      const OrderCouponFirstBuyAndPercentage = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload('cupom4'),
        Util.giveMeAValidUser(),
      );

      expect(OrderCouponFirstBuyAndPercentage).toMatchObject({
        orders: [{ id: '7', amount: 3 }],
      });
    });

    it('should not find the coupon', async () => {
      CouponsMockedService.findOne.mockReturnValue(false);

      await expect(
        ordersService.create(
          Util.giveMeAValidCreateOrderPayload('cupomtest'),
          Util.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Coupon not found'));
    });

    it('should not accept expired cupoun', async () => {
      const cupom = Util.giveMeAValidCoupon('cupom', true, 0);
      CouponsMockedService.findOne.mockReturnValue(cupom);
      CouponsMockedService.checkCoupom.mockReturnValue(false);

      await expect(
        ordersService.create(
          Util.giveMeAValidCreateOrderPayload('cupomtest'),
          Util.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Invalid Coupon'));
    });

    it('should not accept coupon already used too many times', async () => {
      const cupom = Util.giveMeAValidCoupon('cupom', false, 0);
      CouponsMockedService.findOne.mockReturnValue(cupom);
      CouponsMockedService.checkCoupom.mockReturnValue(cupom);

      await expect(
        ordersService.create(
          Util.giveMeAValidCreateOrderPayload('cupomtest'),
          Util.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Coupon exceeded maximum usage'));
    });
  });
});
