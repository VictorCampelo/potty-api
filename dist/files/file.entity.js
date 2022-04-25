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
exports.File = void 0;
const openapi = require("@nestjs/swagger");
const store_entity_1 = require("../stores/store.entity");
const product_entity_1 = require("../products/product.entity");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("typeorm");
let File = class File extends typeorm_1.BaseEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, filename: { required: true, type: () => String }, alternativeText: { required: true, type: () => String }, caption: { required: true, type: () => String }, hash: { required: true, type: () => String }, ext: { required: true, type: () => String }, mime: { required: true, type: () => String }, provider: { required: true, type: () => String }, url: { required: true, type: () => String }, previewUrl: { required: true, type: () => String }, width: { required: true, type: () => Number }, height: { required: true, type: () => Number }, createdBy: { required: true, type: () => Number }, updatedBy: { required: true, type: () => Number }, formats: { required: true, type: () => Object }, providerMetadata: { required: true, type: () => Object }, user: { required: true, type: () => require("../users/user.entity").User }, product: { required: true, type: () => require("../products/product.entity").Product }, store: { required: true, type: () => require("../stores/store.entity").Store }, tags: { required: true, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], File.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], File.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "alternativeText", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "ext", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "mime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], File.prototype, "previewUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int4' }),
    __metadata("design:type", Number)
], File.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int4' }),
    __metadata("design:type", Number)
], File.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int4' }),
    __metadata("design:type", Number)
], File.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int4' }),
    __metadata("design:type", Number)
], File.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'jsonb' }),
    __metadata("design:type", Object)
], File.prototype, "formats", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'jsonb' }),
    __metadata("design:type", Object)
], File.prototype, "providerMetadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.files),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], File.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.files),
    __metadata("design:type", product_entity_1.Product)
], File.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.files),
    __metadata("design:type", store_entity_1.Store)
], File.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-array' }),
    __metadata("design:type", Array)
], File.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], File.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], File.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], File.prototype, "deletedAt", void 0);
File = __decorate([
    (0, typeorm_1.Entity)('file'),
    (0, typeorm_1.Unique)(['url', 'hash', 'filename'])
], File);
exports.File = File;
//# sourceMappingURL=file.entity.js.map