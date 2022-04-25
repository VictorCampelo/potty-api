import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { WebhookRequestDto } from './dto/webhook-request.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createPlanDto: CreatePlanDto): Promise<import("./entities/plan.entity").Plan>;
    updateUserPlanSituation(webhookRequestDto: WebhookRequestDto): Promise<import("../users/user.entity").User>;
    findAll(): string;
    findOne(id: string): Promise<import("./entities/plan.entity").Plan>;
    findByNickname(nickname: string): Promise<import("./entities/plan.entity").Plan>;
    update(id: string, updatePlanDto: UpdatePlanDto): string;
    remove(id: string): string;
}
