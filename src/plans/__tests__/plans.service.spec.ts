import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BuyerhistoryService } from 'src/buyerhistory/buyerhistory.service';
import { EmailsService } from 'src/emails/emails.service';
import PlanUtils from 'src/shared/tests/utils/plan';
import { UsersService } from 'src/users/users.service';
import { Plan } from '../entities/plan.entity';
import { PlansService } from '../plans.service';
// import Util from './util/util';

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
        UsersService,
        EmailsService,
        BuyerhistoryService,
        { provide: getRepositoryToken(Plan), useValue: mockRepository },
      ],
    })
      .overrideProvider(UsersService)
      .useValue({})
      .overrideProvider(EmailsService)
      .useValue({})
      .overrideProvider(BuyerhistoryService)
      .useValue({})
      .compile();
    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne plan', () => {
    it('should find a plan', async () => {
      const plan = PlanUtils.giveMeAValidPlan();
      mockRepository.findOne.mockReturnValue(plan);
      const foundPlan = await service.findOne(plan.id);

      expect(foundPlan).toMatchObject(plan);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
