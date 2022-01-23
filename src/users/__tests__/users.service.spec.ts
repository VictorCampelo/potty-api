import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from 'src/files/files.service';
import { UserRepository } from '../users.repository';
import { UsersService } from '../users.service';
import Util from './util/util';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    createUser: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UserRepository, FilesService],
    })
      .overrideProvider(FilesService)
      .useValue({})
      .overrideProvider(UserRepository)
      .useValue(mockRepository) //when is custom repository
      .compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should find a User by id', async () => {
      const user = Util.giveMeAValidUser('1');

      mockRepository.findOne.mockReturnValue(user);
      const foundUser = await service.findUserById('1');

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(foundUser).toMatchObject(user);
    });
  });
});
