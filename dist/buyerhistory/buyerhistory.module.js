"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerhistoryModule = void 0;
const common_1 = require("@nestjs/common");
const buyerhistory_service_1 = require("./buyerhistory.service");
const buyerhistory_controller_1 = require("./buyerhistory.controller");
const buyerhistory_entity_1 = require("./entities/buyerhistory.entity");
const typeorm_1 = require("@nestjs/typeorm");
let BuyerhistoryModule = class BuyerhistoryModule {
};
BuyerhistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([buyerhistory_entity_1.BuyerHistory])],
        controllers: [buyerhistory_controller_1.BuyerhistoryController],
        providers: [buyerhistory_service_1.BuyerhistoryService],
        exports: [buyerhistory_service_1.BuyerhistoryService],
    })
], BuyerhistoryModule);
exports.BuyerhistoryModule = BuyerhistoryModule;
//# sourceMappingURL=buyerhistory.module.js.map