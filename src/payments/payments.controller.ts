import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ErrorHandling } from 'src/configs/error-handling';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @Role(UserRole.ADMIN)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      return this.paymentsService.create(createPaymentDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('find')
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get('findone/:id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete('delete/:id')
  @Role(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
