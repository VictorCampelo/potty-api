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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserStore = void 0;
const openapi = require("@nestjs/swagger");
const create_user_dto_1 = require("../../users/dto/create-user.dto");
const create_store_dto_1 = require("../../stores/dto/create-store.dto");
const swagger_1 = require("@nestjs/swagger");
class CreateUserStore {
    static _OPENAPI_METADATA_FACTORY() {
        return { storeDto: { required: true, type: () => require("../../stores/dto/create-store.dto").CreateStoreDto }, userDto: { required: true, type: () => require("../../users/dto/create-user.dto").CreateUserDto } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_store_dto_1.CreateStoreDto)
], CreateUserStore.prototype, "storeDto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", create_user_dto_1.CreateUserDto)
], CreateUserStore.prototype, "userDto", void 0);
exports.CreateUserStore = CreateUserStore;
//# sourceMappingURL=create-user-store.dto.js.map