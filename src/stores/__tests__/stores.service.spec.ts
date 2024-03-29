import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from '../stores.service';
import { StoreRepository } from '../stores.repository';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PaymentsService } from 'src/payments/payments.service';
import StoreUtils from 'src/shared/tests/utils/store';

describe('StoresService', () => {
  let service: StoresService;

  const mockRepository = {
    createStore: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findByIds: jest.fn(),
    addLike: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        StoreRepository,
        UsersService,
        FilesService,
        CategoriesService,
        PaymentsService,
      ],
    })
      .overrideProvider(StoreRepository)
      .useValue(mockRepository)
      .overrideProvider(UsersService)
      .useValue({})
      .overrideProvider(FilesService)
      .useValue({})
      .overrideProvider(CategoriesService)
      .useValue({})
      .overrideProvider(PaymentsService)
      .useValue({})
      .compile();
    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByIds', () => {
    it('should all Stores by ids', async () => {
      const store1 = StoreUtils.giveMeAValidStore('1', '123123123');
      const store2 = StoreUtils.giveMeAValidStore('2', '123123456');
      mockRepository.findByIds.mockReturnValue([store1, store2]);
      const foundStores = await service.findAllByIds(['1', '2']);

      expect(foundStores).toMatchObject([store1, store2]);
    });
  });
});
