import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolsService } from './tools.service';
import { ReturnToolDto } from './dto/return-tool.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Tool } from './tool.entity';

@Controller('tools')
@UseGuards(AuthGuard(), RolesGuard)
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(ClassSerializerInterceptor)
  async createTool(
    @Body(ValidationPipe) createToolDto: CreateToolDto,
    @GetUser() user: User,
  ): Promise<ReturnToolDto> {
    const tool = await this.toolsService.createTools(createToolDto, user);
    return {
      tool,
      message: 'Ferramenta cadastrado com sucesso',
    };
  }

  @Get()
  async findByTag(@Query() queryParam): Promise<Tool[]> {
    const tools = await this.toolsService.findByTag(queryParam.tag);
    return tools;
  }

  @Get('user')
  async findByUser(@GetUser() user: User): Promise<Tool[]> {
    const tools = await this.toolsService.findByUser(user);
    return tools;
  }

  @Get('all')
  async findAll() {
    const tools = await this.toolsService.findAll();
    return tools;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.toolsService.deleteTool(id);
  }
}
