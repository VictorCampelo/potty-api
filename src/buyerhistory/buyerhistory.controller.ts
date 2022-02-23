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
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user-roles.enum';
import { BuyerhistoryService } from './buyerhistory.service';
import { CreateBuyerhistoryDto } from './dto/create-buyerhistory.dto';
import { UpdateBuyerhistoryDto } from './dto/update-buyerhistory.dto';

@Controller('buyerhistory')
export class BuyerhistoryController {
  constructor(private readonly buyerhistoryService: BuyerhistoryService) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Role(UserRole.ADMIN)
  async create(@Body() createBuyerhistoryDto: CreateBuyerhistoryDto) {
    return this.buyerhistoryService.create(createBuyerhistoryDto);
  }

  @Get()
  findAll() {
    return this.buyerhistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerhistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuyerhistoryDto: UpdateBuyerhistoryDto,
  ) {
    return this.buyerhistoryService.update(+id, updateBuyerhistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerhistoryService.remove(+id);
  }
}
