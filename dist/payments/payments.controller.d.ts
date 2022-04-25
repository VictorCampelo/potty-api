import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<import("./entities/payments.entity").Payment>;
    findAll(): Promise<import("./entities/payments.entity").Payment[]>;
    findOne(id: string): Promise<import("./entities/payments.entity").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
