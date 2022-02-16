import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payments.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    createPaymentDto.methodName = createPaymentDto.methodName.toLowerCase();
    const paymentMethod = this.paymentRepository.create(createPaymentDto);
    return paymentMethod.save();
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findByName(methods: string[]) {
    return this.paymentRepository.find({
      where: {
        methodName: In(methods),
      },
    });
  }

  async findOne(id: string) {
    return this.paymentRepository.findOne(id);
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.update(id, updatePaymentDto);
  }

  async remove(id: string) {
    return this.paymentRepository.delete(id);
  }
}
