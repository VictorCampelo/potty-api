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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payments_entity_1 = require("./entities/payments.entity");
let PaymentsService = class PaymentsService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async create(createPaymentDto) {
        createPaymentDto.methodName = createPaymentDto.methodName.toLowerCase();
        const paymentMethod = this.paymentRepository.create(createPaymentDto);
        return paymentMethod.save();
    }
    async findAll() {
        return this.paymentRepository.find();
    }
    async findByName(methods) {
        return this.paymentRepository.find({
            where: {
                methodName: (0, typeorm_2.In)(methods),
            },
        });
    }
    async findOne(id) {
        return this.paymentRepository.findOne(id);
    }
    async update(id, updatePaymentDto) {
        return this.paymentRepository.update(id, updatePaymentDto);
    }
    async remove(id) {
        return this.paymentRepository.delete(id);
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payments_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map