"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoricRepository = void 0;
const order_historic_entity_1 = require("./entities/order-historic.entity");
const typeorm_1 = require("typeorm");
let OrderHistoricRepository = class OrderHistoricRepository extends typeorm_1.Repository {
};
OrderHistoricRepository = __decorate([
    (0, typeorm_1.EntityRepository)(order_historic_entity_1.OrderHistoric)
], OrderHistoricRepository);
exports.OrderHistoricRepository = OrderHistoricRepository;
//# sourceMappingURL=order-historics.repository.js.map