import { ProductsService } from 'src/products/products.service';
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
import { StoresService } from 'src/stores/stores.service';
import { FindFeedbackDto } from './dto/find-feedback.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService,
  ) {}

  @Post(':storeId')
  @Role(UserRole.USER)
  async create(
    @GetUser() user: User,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Param('storeId') storeId: string,
  ) {
    try {
      const store = await this.storesService.findOne(storeId);
      return await this.feedbackService.create(createFeedbackDto, user, store);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  //DASHBOARD
  @Get('findAllFromStore/:id')
  async findAllFeedbacksFromStore(@Param('id') storeId: string) {
    try {
      return await this.feedbackService.findAllFeedbacksFromStore(storeId);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get('fromProduct/:id')
  async fromProduct(
    @Param('id') productId: string,
    @Query() findFeedbackDto: FindFeedbackDto,
  ) {
    try {
      return await this.feedbackService.fromProduct(productId, findFeedbackDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.feedbackService.findOne(+id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    try {
      return await this.feedbackService.update(id, updateFeedbackDto);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.feedbackService.remove(+id);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
