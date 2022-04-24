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
exports.CouponsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const role_decorator_1 = require("../auth/role.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const error_handling_1 = require("../configs/error-handling");
const user_roles_enum_1 = require("../users/user-roles.enum");
const user_entity_1 = require("../users/user.entity");
const coupons_service_1 = require("./coupons.service");
const create_coupon_dto_1 = require("./dto/create-coupon.dto");
const update_coupon_dto_1 = require("./dto/update-coupon.dto");
let CouponsController = class CouponsController {
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async create(createCouponDto, user) {
        try {
            return await this.couponsService.create(createCouponDto, user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async find(user) {
        try {
            return await this.couponsService.findAll(user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async findCoupon(couponCode, user) {
        try {
            return await this.couponsService.findLocal(couponCode, user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async updateCoupon(couponCode, updateCouponDto, user) {
        try {
            return await this.couponsService.update(updateCouponDto, user.storeId, couponCode);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
    async deleteCoupon(code, user) {
        try {
            return await this.couponsService.remove(code, user.storeId);
        }
        catch (error) {
            throw new error_handling_1.ErrorHandling(error);
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 201, type: require("./entities/coupon.entity").Coupon }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200, type: [require("./entities/coupon.entity").Coupon] }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "find", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200, type: require("./entities/coupon.entity").Coupon }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "findCoupon", null);
__decorate([
    (0, common_1.Patch)(':code'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_coupon_dto_1.UpdateCouponDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "updateCoupon", null);
__decorate([
    (0, common_1.Delete)(':code'),
    (0, role_decorator_1.Role)(user_roles_enum_1.UserRole.OWNER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "deleteCoupon", null);
CouponsController = __decorate([
    (0, swagger_1.ApiTags)('coupons'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
exports.CouponsController = CouponsController;
//# sourceMappingURL=coupons.controller.js.map