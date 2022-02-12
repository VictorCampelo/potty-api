import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { StoresService } from 'src/stores/stores.service';
import { Feedback } from '../feedback.entity';
import { FeedbackService } from '../feedback.service';
import Util from './Util/Util';

describe('FeedbacksService', () => {
  let service: FeedbackService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const ProductsMockedService = {
    saveAll: jest.fn(),
  };
  const StoresMockedService = {
    save: jest.fn(),
  };
  const OrdersMockedService = {
    findAllOrderByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: getRepositoryToken(Feedback), useValue: mockRepository },
        { provide: ProductsService, useValue: ProductsMockedService },
        { provide: StoresService, useValue: StoresMockedService },
        { provide: OrdersService, useValue: OrdersMockedService },
      ],
    }).compile();
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Feedbacks Service', () => {
    it('should create a Feedback', async () => {
      OrdersMockedService.findAllOrderByUser.mockReturnValue([
        Util.giveMeAValidOrder(),
      ]);

      mockRepository.save.mockReturnValue({
        id: '1',
        ...Util.giveMeAValidCreateFeedbackDto(),
      });

      const feedback = await service.create(
        Util.giveMeAValidCreateFeedbackDto(),
        Util.giveMeAValidUser(),
        Util.giveMeAValidStore(),
      );

      expect(feedback).toMatchObject({
        id: '1',
        ...Util.giveMeAValidCreateFeedbackDto(),
      });
    });
  });
});
