import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CouponsService } from 'src/coupons/coupons.service';
import { OrderHistoricsService } from 'src/order-historics/order-historics.service';
import { ProductsService } from 'src/products/products.service';
import CouponUtils from 'src/shared/tests/utils/coupon';
import { CouponDiscountType, CouponRange } from 'src/shared/tests/utils/dto';
import OrderUtils from 'src/shared/tests/utils/order';
import PayloadUtils from 'src/shared/tests/utils/payload';
import ProductUtils from 'src/shared/tests/utils/product';
import StoreUtils from 'src/shared/tests/utils/store';
import UserUtils from 'src/shared/tests/utils/user';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { createConnections, getConnection } from 'typeorm';
import { Order } from '../order.entity';
import { OrdersService } from '../orders.service';

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
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('1'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('2'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('3'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('4'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('5'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('6'))
      .mockReturnValueOnce(OrderUtils.giveMeAValidCreatedOrder('7'));
    UsersMockedService.findUserById.mockReturnValue(
      UserUtils.giveMeAValidUser(),
    );
    /* global mocks --- */
    it('should create a simple order', async () => {
      /* --- mocks */
      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        ProductUtils.giveMeAValidProduct('1', '1', 10, 15, 'Cadeira'),
        ProductUtils.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]);
      StoresMockedService.findAllByIds.mockReturnValue([
        StoreUtils.giveMeAValidStore('1', '86981834269', [
          'visa',
          'pix',
          'boleto',
        ]),
      ]);
      /* mocks --- */

      /* - main test - */

      const createOrder = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderPayload(),
        UserUtils.giveMeAValidUser(),
      );

      /* - main test - */

      expect(createOrder).toMatchObject({
        orders: [{ amount: 30, id: '1' }],
      });
    });

    it('should creater order with discount', async () => {
      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        ProductUtils.giveMeAValidProduct('3', '1', 10, 15, 'Geladeira', 20),
        ProductUtils.giveMeAValidProduct('4', '2', 10, 15, 'Cafeteira', 80),
      ]);
      StoresMockedService.findAllByIds.mockReturnValue([
        StoreUtils.giveMeAValidStore('1', '86981834269', [
          'visa',
          'pix',
          'boleto',
        ]),
        StoreUtils.giveMeAValidStore('2', '86981818181', [
          'visa',
          'pix',
          'boleto',
        ]),
      ]);

      const createOrder = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderWithDiscountPayload(),
        UserUtils.giveMeAValidUser(),
      );

      expect(createOrder).toMatchObject({
        orders: [
          { id: '2', amount: 24 },
          { id: '3', amount: 4 },
        ],
      });
    });

    it('should make an order using coupon', async () => {
      const cupom = CouponUtils.giveMeAValidCoupon('cupom', false, 100, '1');
      const cupom2 = CouponUtils.giveMeAValidCoupon(
        'cupom2',
        false,
        100,
        '1',
        CouponRange.store,
        ['1'],
        CouponDiscountType.money,
        15,
      );
      const cupom3 = CouponUtils.giveMeAValidCoupon(
        'cupom3',
        false,
        100,
        '1',
        CouponRange.first_buy,
        ['1'],
        CouponDiscountType.money,
        10,
      );
      const cupom4 = CouponUtils.giveMeAValidCoupon(
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
        StoreUtils.giveMeAValidStore('1', '86981834269', [
          'visa',
          'pix',
          'boleto',
        ]),
        StoreUtils.giveMeAValidStore('2', '86981818181', [
          'visa',
          'pix',
          'boleto',
        ]),
      ]);

      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        ProductUtils.giveMeAValidProduct('1', '1', 10, 15, 'Cadeira'),
        ProductUtils.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]);

      const createOrder = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderPayload('cupom'),
        UserUtils.giveMeAValidUser(),
      );

      expect(createOrder).toMatchObject({ orders: [{ id: '4', amount: 25 }] });

      const createOrderWithCouponForStore = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderPayload('cupom2'),
        UserUtils.giveMeAValidUser(),
      );

      expect(createOrderWithCouponForStore).toMatchObject({
        orders: [{ id: '5', amount: 15 }],
      });

      const createOrderWithCouponForFirstBuy = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderPayload('cupom3'),
        UserUtils.giveMeAValidUser(),
      );

      expect(createOrderWithCouponForFirstBuy).toMatchObject({
        orders: [{ id: '6', amount: 20 }],
      });

      const OrderCouponFirstBuyAndPercentage = await ordersService.create(
        PayloadUtils.giveMeAValidCreateOrderPayload('cupom4'),
        UserUtils.giveMeAValidUser(),
      );

      expect(OrderCouponFirstBuyAndPercentage).toMatchObject({
        orders: [{ id: '7', amount: 3 }],
      });
    });

    it('should not find the coupon', async () => {
      CouponsMockedService.findOne.mockReturnValue(false);

      await expect(
        ordersService.create(
          PayloadUtils.giveMeAValidCreateOrderPayload('cupomtest'),
          UserUtils.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Coupon not found'));
    });

    it('should not accept expired cupoun', async () => {
      const cupom = CouponUtils.giveMeAValidCoupon('cupom', true, 0);
      CouponsMockedService.findOne.mockReturnValue(cupom);
      CouponsMockedService.checkCoupom.mockReturnValue(false);

      await expect(
        ordersService.create(
          PayloadUtils.giveMeAValidCreateOrderPayload('cupomtest'),
          UserUtils.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Invalid Coupon'));
    });

    it('should not accept coupon already used too many times', async () => {
      const cupom = CouponUtils.giveMeAValidCoupon('cupom', false, 0);
      CouponsMockedService.findOne.mockReturnValue(cupom);
      CouponsMockedService.checkCoupom.mockReturnValue(cupom);

      await expect(
        ordersService.create(
          PayloadUtils.giveMeAValidCreateOrderPayload('cupomtest'),
          UserUtils.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(new Error('Coupon exceeded maximum usage'));
    });

    it('shoud not accept a payment method', async () => {
      ProductsMockedService.findProductstByIdsAndStoreId.mockReturnValue([
        ProductUtils.giveMeAValidProduct('1', '1', 10, 15, 'Cadeira'),
        ProductUtils.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]);
      StoresMockedService.findAllByIds.mockReturnValue([
        StoreUtils.giveMeAValidStore('1', '86981834269', ['test']),
      ]);
      /* mocks --- */

      /* - main test - */

      await expect(
        ordersService.create(
          PayloadUtils.giveMeAValidCreateOrderPayload(),
          UserUtils.giveMeAValidUser(),
        ),
      ).rejects.toThrowError(
        new Error('Store minha loja doesnt accept visa as a payment method'),
      );
    });
  });
});
