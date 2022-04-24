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
exports.PlansController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const plans_service_1 = require("./plans.service");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const role_decorator_1 = require("../auth/role.decorator");
const user_roles_enum_1 = require("../users/user-roles.enum");
const error_handling_1 = require("../configs/error-handling");
const webhook_request_dto_1 = require("./dto/webhook-request.dto");
let PlansController = class PlansController {
    constructor(plansService) {
        this.plansService = plansService;
    }
    async create(createPlanDto) {
        try {
            return await this.plansService.create(createPlanDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateUserPlanSituation(webhookRequestDto) {
        try {
            if (webhookRequestDto.api_key !== process.env.EDUZZ_API_KEY) {
                throw new common_1.HttpException('Invalid request', common_1.HttpStatus.FORBIDDEN);
            }
            return await this.plansService.updateUserPlanSituation(webhookRequestDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    findAll() {
        return this.plansService.findAll();
    }
    findOne(id) {
        return this.plansService.findOne(id);
    }
    async findByNickname(nickname) {
        return this.plansService.publicFindByNickname(nickname);
    }
    update(id, updatePlanDto) {
        return this.plansService.update(+id, updatePlanDto);
    }
    remove(id) {
        return this.plansService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201, type: require("./entities/plan.entity").Plan }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('eduzz/update'),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200, type: require("../users/user.entity").User }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_request_dto_1.WebhookRequestDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "updateUserPlanSituation", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./entities/plan.entity").Plan }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('find/:nickname'),
    openapi.ApiResponse({ status: 200, type: require("./entities/plan.entity").Plan }),
    __param(0, (0, common_1.Param)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findByNickname", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "remove", null);
PlansController = __decorate([
    (0, common_1.Controller)('plans'),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansController);
exports.PlansController = PlansController;
//# sourceMappingURL=plans.controller.js.map