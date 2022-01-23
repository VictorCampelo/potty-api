import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plan } from '../entities/plan.entity';
import { PlansService } from '../plans.service';
import Util from './util/util';

describe('PlansService', () => {
  let service: PlansService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        { provide: getRepositoryToken(Plan), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne plan', () => {
    it('should find a plan', async () => {
      const plan = Util.giveMeAValidPlan();
      mockRepository.findOne.mockReturnValue(plan);
      const foundPlan = await service.findOne(plan.id);

      expect(foundPlan).toMatchObject(plan);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
