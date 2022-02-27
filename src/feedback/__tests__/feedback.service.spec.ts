import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import FeedbackUtils from 'src/shared/tests/utils/feedback';
import OrderUtils from 'src/shared/tests/utils/order';
import StoreUtils from 'src/shared/tests/utils/store';
import UserUtils from 'src/shared/tests/utils/user';
import { StoresService } from 'src/stores/stores.service';
import { Feedback } from '../feedback.entity';
import { FeedbackService } from '../feedback.service';

describe('FeedbacksService', () => {
  let service: FeedbackService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
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
    it('should not find the Product because create payload is invalid', async () => {
      OrdersMockedService.findAllOrderByUser.mockReturnValue([
        OrderUtils.giveMeAValidOrder('1'), //orderId = 1
      ]);

      await expect(
        service.create(
          FeedbackUtils.giveMeAValidCreateFeedbackDto('2', '1'), // orderId=2
          UserUtils.giveMeAValidUser(),
          StoreUtils.giveMeAValidStore('1', '86123123123'),
        ),
      ).rejects.toThrowError(new Error('Product not bought by this User'));
    });

    it('should give an error because the User has already registered a feedback', async () => {
      OrdersMockedService.findAllOrderByUser.mockReturnValue([
        OrderUtils.giveMeAValidOrder(),
      ]);

      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        andWhere: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getOne: jest.fn().mockImplementationOnce(() => {
          return FeedbackUtils.giveMeAValidFeedback();
        }),
      };

      jest
        .spyOn(mockRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await expect(
        service.create(
          FeedbackUtils.giveMeAValidCreateFeedbackDto(), // orderId=2
          UserUtils.giveMeAValidUser(),
          StoreUtils.giveMeAValidStore('1', '86123123123'),
        ),
      ).rejects.toThrowError(
        new Error('You already gave a feedback to this Product.'),
      );
    });

    it('should create a Feedback', async () => {
      OrdersMockedService.findAllOrderByUser.mockReturnValue([
        OrderUtils.giveMeAValidOrder(),
      ]);

      const createQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        andWhere: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getOne: jest.fn().mockImplementationOnce(() => {
          return false;
        }),
      };

      jest
        .spyOn(mockRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      mockRepository.save.mockReturnValue({
        id: '1',
        ...FeedbackUtils.giveMeAValidCreateFeedbackDto(),
      });

      const feedback = await service.create(
        FeedbackUtils.giveMeAValidCreateFeedbackDto(), // orderId=2
        UserUtils.giveMeAValidUser(),
        StoreUtils.giveMeAValidStore('1', '86123123123'),
      );

      expect(feedback).toMatchObject({
        id: '1',
        ...FeedbackUtils.giveMeAValidCreateFeedbackDto(),
      });
    });
  });
});
