import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { ErrorHandling } from 'src/configs/error-handling';
import { WebhookRequestDto } from './dto/webhook-request.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async create(@Body(ValidationPipe) createPlanDto: CreatePlanDto) {
    try {
      return await this.plansService.create(createPlanDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Post('eduzz/update')
  @HttpCode(200)
  async updateUserPlanSituation(@Body() webhookRequestDto: WebhookRequestDto) {
    try {
      if (webhookRequestDto.api_key !== process.env.EDUZZ_API_KEY) {
        throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
      }

      return await this.plansService.updateUserPlanSituation(webhookRequestDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Get('find/:nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return this.plansService.publicFindByNickname(nickname);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(+id);
  }
}
