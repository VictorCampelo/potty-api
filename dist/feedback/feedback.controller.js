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
exports.FeedbackController = void 0;
const openapi = require("@nestjs/swagger");
const products_service_1 = require("../products/products.service");
const common_1 = require("@nestjs/common");
const feedback_service_1 = require("./feedback.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const update_feedback_dto_1 = require("./dto/update-feedback.dto");
const roles_guard_1 = require("../auth/roles.guard");
const passport_1 = require("@nestjs/passport");
const role_decorator_1 = require("../auth/role.decorator");
const user_roles_enum_1 = require("../users/user-roles.enum");
const user_entity_1 = require("../users/user.entity");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const error_handling_1 = require("../configs/error-handling");
const stores_service_1 = require("../stores/stores.service");
const find_feedback_dto_1 = require("./dto/find-feedback.dto");
const swagger_1 = require("@nestjs/swagger");
let FeedbackController = class FeedbackController {
    constructor(feedbackService, storesService, productsService) {
        this.feedbackService = feedbackService;
        this.storesService = storesService;
        this.productsService = productsService;
    }
    async create(user, createFeedbackDto, storeId) {
        try {
            const store = await this.storesService.findOne(storeId);
            return await this.feedbackService.create(createFeedbackDto, user, store);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findAllFeedbacksFromStore(storeId) {
        try {
            return await this.feedbackService.findAllFeedbacksFromStore(storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async fromProduct(productId, findFeedbackDto) {
        try {
            return await this.feedbackService.fromProduct(productId, findFeedbackDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findOne(id) {
        try {
            return await this.feedbackService.findOne(+id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async update(id, updateFeedbackDto) {
        try {
            return await this.feedbackService.update(id, updateFeedbackDto);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    remove(id) {
        try {
            return this.feedbackService.remove(+id);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Post)(':storeId'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.USER),
    openapi.ApiResponse({ status: 201, type: require("./feedback.entity").Feedback }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_feedback_dto_1.CreateFeedbackDto, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('findAllFromStore/:id'),
    openapi.ApiResponse({ status: 200, type: [require("./feedback.entity").Feedback] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAllFeedbacksFromStore", null);
__decorate([
    (0, common_1.Get)('fromProduct/:id'),
    openapi.ApiResponse({ status: 200, type: [require("./feedback.entity").Feedback] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, find_feedback_dto_1.FindFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "fromProduct", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "remove", null);
FeedbackController = __decorate([
    (0, swagger_1.ApiTags)('feedback'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService,
        stores_service_1.StoresService,
        products_service_1.ProductsService])
], FeedbackController);
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map