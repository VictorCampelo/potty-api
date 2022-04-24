"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const buyerhistory_service_1 = require("../buyerhistory/buyerhistory.service");
const emails_service_1 = require("../emails/emails.service");
const users_service_1 = require("../users/users.service");
const typeorm_2 = require("typeorm");
const plan_entity_1 = require("./entities/plan.entity");
let PlansService = class PlansService {
    constructor(plansRepository, usersService, emailsService, buyerhistoryService) {
        this.plansRepository = plansRepository;
        this.usersService = usersService;
        this.emailsService = emailsService;
        this.buyerhistoryService = buyerhistoryService;
    }
    async create(createPlanDto) {
        const plan = this.plansRepository.create(createPlanDto);
        return this.plansRepository.save(plan);
    }
    async updateUserPlanSituation(webhookRequestDto) {
        const trans_status = parseInt(webhookRequestDto.trans_status.toString());
        const plan = await this.plansRepository.findOne({
            where: {
                code: webhookRequestDto.product_cod,
            },
        });
        if (!plan) {
            throw new common_1.HttpException('Plan not found', common_1.HttpStatus.NOT_FOUND);
        }
        let user = await this.usersService.findByEmail(webhookRequestDto.cus_email);
        let generatedPassword = '';
        if (!user) {
            generatedPassword = Math.random().toString(36).slice(-14);
            user = await this.usersService.createOwnerUser({
                email: webhookRequestDto.cus_email,
                firstName: webhookRequestDto.cus_name.split(' ')[0],
                lastName: webhookRequestDto.cus_name.split(' ')[1] || '',
                password: generatedPassword,
                passwordConfirmation: generatedPassword,
            });
        }
        if (trans_status === 3) {
            user.plan = plan;
            await user.save();
            await this.buyerhistoryService.create({
                paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
                accountStatus: 'Paga',
                user,
            });
            if (!generatedPassword) {
                await this.emailsService.sendEmail(user.email, 'Boa de venda - Parabéns! Seu plano já está ativado', 'plan-activated', {
                    planName: plan.name,
                    planValue: plan.price,
                });
            }
            else {
                await this.emailsService.sendEmail(user.email, 'Boa de venda - Parabéns! Seu plano já está ativado, falta ativar sua conta', 'plan-activated-created-user', {
                    planName: plan.name,
                    planValue: plan.price,
                    userToken: user.confirmationToken,
                    userTokenDigits: user.confirmationTokenDigits,
                    generatedPassword,
                });
            }
            return user;
        }
        else if (trans_status === 1) {
            await this.buyerhistoryService.create({
                paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
                accountStatus: 'Aberta',
                user,
            });
            await this.emailsService.sendEmail(user.email, 'Boa de venda - Solicitação de compra de Plano', 'plan-requested', {
                planName: plan.name,
                planValue: plan.price,
                fullName: user.firstName + ' ' + user.lastName,
            });
            return;
        }
        else if (trans_status === 4) {
            await this.buyerhistoryService.create({
                paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
                accountStatus: 'Cancelada',
                user,
            });
            await this.emailsService.sendEmail(user.email, 'Boa de venda - Compra cancelada', 'plan-requested', {
                planName: plan.name,
                planValue: plan.price,
                fullName: user.firstName + ' ' + user.lastName,
            });
            return;
        }
        throw new common_1.HttpException('Could not be completed', common_1.HttpStatus.FAILED_DEPENDENCY);
    }
    findAll() {
        return `This action returns all plans`;
    }
    async findOne(id) {
        return this.plansRepository.findOne(id);
    }
    async findByNickname(nickname) {
        return this.plansRepository.findOne({
            where: {
                nickname,
            },
        });
    }
    async publicFindByNickname(nickname) {
        return this.plansRepository
            .createQueryBuilder()
            .where('Plan.nickname = :nickname', { nickname: nickname })
            .select(['Plan.id', 'Plan.url', 'Plan.name', 'Plan.nickname'])
            .getOne();
    }
    update(id, updatePlanDto) {
        return `This action updates a #${id} plan`;
    }
    remove(id) {
        return `This action removes a #${id} plan`;
    }
};
PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        emails_service_1.EmailsService,
        buyerhistory_service_1.BuyerhistoryService])
], PlansService);
exports.PlansService = PlansService;
//# sourceMappingURL=plans.service.js.map