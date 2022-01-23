import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ProductsService } from '../products.service';
import { FilesService } from 'src/files/files.service';
import { StoresService } from 'src/stores/stores.service';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';

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
      const product = new Product();
      product.id = '1';
      product.storeId = '2';
      mockRepository.findByIds.mockReturnValue([product]);

      const spy = jest.spyOn(service, 'findProductstByIdsAndStoreId');
      const productsFound = await service.findProductstByIdsAndStoreId(
        [product.id],
        product.storeId,
      );

      expect(spy).toHaveBeenCalled();

      expect(productsFound).toMatchObject([product]);
    });
  });
});
