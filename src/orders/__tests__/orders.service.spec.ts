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
    create: jest.fn().mockReturnValue(Util.giveMeAValidCreatedOrder('1')),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const ProductsMockedService = {
    findProductstByIdsAndStoreId: jest
      .fn()
      .mockReturnValue([
        Util.giveMeAValidProduct('1', '1', 10, 15, 'Geladeira'),
        Util.giveMeAValidProduct('2', '1', 10, 15, 'Geladeira'),
      ]),
    saveProducts: jest.fn(),
    saveAll: jest.fn(),
  };

  const StoresMockedService = {
    findAllByIds: jest
      .fn()
      .mockReturnValue([Util.giveMeAValidStore('1', '86981834269')]),
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
    findUserById: jest.fn().mockReturnValue(Util.giveMeAValidUser()),
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
    it('should create a simple order', async () => {
      /* - main test - */
      const createOrder = await ordersService.create(
        Util.giveMeAValidCreateOrderPayload(),
        Util.giveMeAValidUser(),
      );

      console.log(createOrder);

      /* - main test - */

      expect(createOrder).toEqual({
        messages: [
          "https://api.whatsapp.com/send?phone=5586981834269&text=🛍️ *Novo pedido!* 🛍️%0a%0a*Nome do Cliente:* Rodrigo Brito%0a%0a*Itens do Pedido:*%0a  🏷️ 3x Geladeira%0a%0a*Total do Pedido:* R$ 30%0a*Forma de Envio:* Retirada em loja%0a%0a*Forma de pagamento:* À vista: 'Geladeira'%0a%0a*Endereço do Cliente:*%0a*Rua*: Rua Jornalista Helder Feitosa%0a*Número:* 1131%0a*Bairro:* Ininga%0a*Cidade:* Teresina - PI",
        ],
        orders: [{ amount: 30, id: '1' }],
      });
    });
  });
});
