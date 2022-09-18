import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerhistoryService } from 'src/buyerhistory/buyerhistory.service';
import { EmailsService } from 'src/emails/emails.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
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
    private buyerhistoryService: BuyerhistoryService,
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

    let user = await this.usersService.findByEmail(webhookRequestDto.cus_email);
    let generatedPassword = '';
    if (!user) {
      generatedPassword = Math.random().toString(36).slice(-14);
      user = await this.usersService.createOwnerUser({
        email: webhookRequestDto.cus_email,
        firstName: webhookRequestDto.cus_name.split(' ')[0],
        lastName: webhookRequestDto.cus_name.split(' ')[1] || '',
        password: generatedPassword,
        passwordConfirmation: generatedPassword,
      } as CreateUserDto);
    }
    //fatura paga
    if (trans_status === 3) {
      user.plan = plan;

      await user.save();

      await this.buyerhistoryService.create({
        paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
        accountStatus: 'Paga',
        user,
      });

      if (!generatedPassword) {
        await this.emailsService.sendEmail(
          user.email,
          'Potty - Parabéns! Seu plano já está ativado',
          'plan-activated',
          {
            planName: plan.name,
            planValue: plan.price,
          },
        );
      } else {
        await this.emailsService.sendEmail(
          user.email,
          'Potty - Parabéns! Seu plano já está ativado, falta ativar sua conta',
          'plan-activated-created-user',
          {
            planName: plan.name,
            planValue: plan.price,
            userToken: user.confirmationToken,
            userTokenDigits: user.confirmationTokenDigits,
            generatedPassword,
          },
        );
      }

      return user;
    } else if (trans_status === 1) {
      await this.buyerhistoryService.create({
        paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
        accountStatus: 'Aberta',
        user,
      });

      await this.emailsService.sendEmail(
        user.email,
        'Potty - Solicitação de compra de Plano',
        'plan-requested',
        {
          planName: plan.name,
          planValue: plan.price,
          fullName: user.firstName + ' ' + user.lastName,
        },
      );
      return;
    } else if (trans_status === 4) {
      await this.buyerhistoryService.create({
        paymentMethod: webhookRequestDto.trans_paymentmethod.toString(),
        accountStatus: 'Cancelada',
        user,
      });

      await this.emailsService.sendEmail(
        user.email,
        'Potty - Compra cancelada',
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

  async findByNickname(nickname: string) {
    return this.plansRepository.findOne({
      where: {
        nickname,
      },
    });
  }

  async publicFindByNickname(nickname: string) {
    return this.plansRepository
      .createQueryBuilder()
      .where('Plan.nickname = :nickname', { nickname: nickname })
      .select(['Plan.id', 'Plan.url', 'Plan.name', 'Plan.nickname'])
      .getOne();
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
