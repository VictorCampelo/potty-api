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

@UseGuards(AuthGuard(), RolesGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService,
  ) {}

  @Post(':storeId/:productId')
  @Role(UserRole.USER)
  async create(
    @GetUser() user: User,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    try {
      const store = await this.storesService.findOne(storeId);
      const product = await this.productsService.findOne(productId, {
        relations: { order: true },
      });
      return await this.feedbackService.create(
        createFeedbackDto,
        product,
        user,
        store,
      );
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  //DASHBOARD
  @Get('findAllFromStore/:id')
  async findAllFeedbacksFromStore(@Param('id') store_id: string) {
    try {
      return await this.feedbackService.findAllFeedbacksFromStore(store_id);
    } catch (error) {
      new ErrorHandling(error);
    }
  }

  @Get('fromProduct/:id')
  async fromProduct(@Param('id') product_id: string) {
    try {
      return await this.feedbackService.fromProduct(product_id);
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
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}
