import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreateToolDto } from './dto/create-tool.dto';
import { Tool } from './tool.entity';
import { ToolRepository } from './tool.repository';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(ToolRepository)
    private toolRepository: ToolRepository,
  ) {}

  async createTools(createToolDto: CreateToolDto, user: User): Promise<Tool> {
    return this.toolRepository.createTool(createToolDto, user);
  }
  
  async findByTag(tag: string): Promise<Tool[]> {
    return this.toolRepository.FindToolsByTag(tag);
  }

  async findAll() {
    return this.toolRepository.find();
  }

  async findByUser(user: User) {
    return this.toolRepository.find({ where: { owner: user } });
  }

  async deleteTool(id: string) {
    return this.toolRepository.delete(id);
  }
}
