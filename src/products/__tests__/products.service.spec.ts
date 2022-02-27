import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ProductsService } from '../products.service';
import { FilesService } from 'src/files/files.service';
import { StoresService } from 'src/stores/stores.service';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import ProductUtils from 'src/shared/tests/utils/product';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findByIds: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        FilesService,
        StoresService,
        CategoriesService,
        UsersService,
        { provide: getRepositoryToken(Product), useValue: mockRepository },
      ],
    })
      .overrideProvider(FilesService) //not gonna use
      .useValue({})
      .overrideProvider(StoresService)
      .useValue({})
      .overrideProvider(CategoriesService)
      .useValue({})
      .overrideProvider(UsersService)
      .useValue({})
      .compile();
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find products', () => {
    it('should find products by its IDs and storeId', async () => {
      const storeId = '1';
      const product1 = ProductUtils.giveMeAValidProduct('1', storeId, 10, 20, 'geladeira');
      const product2 = ProductUtils.giveMeAValidProduct('2', storeId, 20, 10, 'cafeteira');
      mockRepository.findByIds.mockReturnValueOnce([product1, product2]);

      const spy = jest.spyOn(service, 'findProductstByIdsAndStoreId');
      const productsFound = await service.findProductstByIdsAndStoreId(
        [product1.id, product2.storeId],
        storeId,
      );

      expect(spy).toHaveBeenCalled();
      expect(productsFound).toMatchObject([product1, product2]);
    });
  });
});
