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
import Util from './util/util';

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
      .mockReturnValueOnce(Util.giveMeAValidCreatedOrder('3'));
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
  });
});
