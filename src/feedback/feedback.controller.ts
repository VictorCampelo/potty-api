import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ErrorHandling } from 'src/configs/error-handling';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Role(UserRole.USER)
  async create(
    @GetUser() user: User,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    try {
      return await this.feedbackService.create(createFeedbackDto, user);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get('findAllFromStore/:id')
  async findAllFeedbacksFromStore(@Param('id') store_id: string) {
    try {
      return await this.feedbackService.findAllFeedbacksFromStore(store_id);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}
