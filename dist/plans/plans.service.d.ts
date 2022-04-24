import { BuyerhistoryService } from 'src/buyerhistory/buyerhistory.service';
import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { Plan } from './entities/plan.entity';
export declare class PlansService {
    private readonly plansRepository;
    private usersService;
    private emailsService;
    private buyerhistoryService;
    constructor(plansRepository: Repository<Plan>, usersService: UsersService, emailsService: EmailsService, buyerhistoryService: BuyerhistoryService);
    create(createPlanDto: CreatePlanDto): Promise<Plan>;
    updateUserPlanSituation(webhookRequestDto: WebhookRequestDto): Promise<import("../users/user.entity").User>;
    findAll(): string;
    findOne(id: string): Promise<Plan>;
    findByNickname(nickname: string): Promise<Plan>;
    publicFindByNickname(nickname: string): Promise<Plan>;
    update(id: number, updatePlanDto: UpdatePlanDto): string;
    remove(id: number): string;
}
