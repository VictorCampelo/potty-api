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
exports.BuyerhistoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_roles_enum_1 = require("../users/user-roles.enum");
const buyerhistory_service_1 = require("./buyerhistory.service");
const create_buyerhistory_dto_1 = require("./dto/create-buyerhistory.dto");
const update_buyerhistory_dto_1 = require("./dto/update-buyerhistory.dto");
let BuyerhistoryController = class BuyerhistoryController {
    constructor(buyerhistoryService) {
        this.buyerhistoryService = buyerhistoryService;
    }
    async create(createBuyerhistoryDto) {
        return this.buyerhistoryService.create(createBuyerhistoryDto);
    }
    findAll() {
        return this.buyerhistoryService.findAll();
    }
    findOne(id) {
        return this.buyerhistoryService.findOne(+id);
    }
    update(id, updateBuyerhistoryDto) {
        return this.buyerhistoryService.update(+id, updateBuyerhistoryDto);
    }
    remove(id) {
        return this.buyerhistoryService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201, type: require("./entities/buyerhistory.entity").BuyerHistory }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_buyerhistory_dto_1.CreateBuyerhistoryDto]),
    __metadata("design:returntype", Promise)
], BuyerhistoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuyerhistoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuyerhistoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_buyerhistory_dto_1.UpdateBuyerhistoryDto]),
    __metadata("design:returntype", void 0)
], BuyerhistoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BuyerhistoryController.prototype, "remove", null);
BuyerhistoryController = __decorate([
    (0, common_1.Controller)('buyerhistory'),
    __metadata("design:paramtypes", [buyerhistory_service_1.BuyerhistoryService])
], BuyerhistoryController);
exports.BuyerhistoryController = BuyerhistoryController;
//# sourceMappingURL=buyerhistory.controller.js.map