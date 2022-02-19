import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
    private usersService: UsersService,
    private emailsService: EmailsService,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    const plan = this.plansRepository.create(createPlanDto);

    return this.plansRepository.save(plan);
  }

  async updateUserPlanSituation(webhookRequestDto: WebhookRequestDto) {
    const trans_status = parseInt(webhookRequestDto.trans_status.toString());
    const plan = await this.plansRepository.findOne({
      where: {
        code: webhookRequestDto.product_cod,
      },
    });

    if (!plan) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.usersService.findByEmail(
      webhookRequestDto.cus_email,
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    //fatura paga
    if (trans_status === 3) {
      user.plan = plan;

      user.save();

      await this.emailsService.sendEmail(
        user.email,
        'Boa de venda - Parabéns! Seu plano já está ativado',
        'plan-activated',
        {
          planName: plan.name,
          planValue: plan.price,
        },
      );

      return user;
    } else if (trans_status === 1) {
      await this.emailsService.sendEmail(
        user.email,
        'Boa de venda - Solicitação de compra de Plano',
        'plan-requested',
        {
          planName: plan.name,
          planValue: plan.price,
          fullName: user.firstName + ' ' + user.lastName,
        },
      );
      return;
    } else if (trans_status === 4) {
      await this.emailsService.sendEmail(
        user.email,
        'Boa de venda - Compra cancelada',
        'plan-requested',
        {
          planName: plan.name,
          planValue: plan.price,
          fullName: user.firstName + ' ' + user.lastName,
        },
      );
      return;
    }

    throw new HttpException(
      'Could not be completed',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }

  findAll() {
    return `This action returns all plans`;
  }

  async findOne(id: string) {
    return this.plansRepository.findOne(id);
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
