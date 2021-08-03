import { EntityRepository, Repository } from 'typeorm';
import { CreateToolDto } from './dto/create-tool.dto';
import { Tool } from './tool.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

@EntityRepository(Tool)
export class ToolRepository extends Repository<Tool> {
  async createTool(
    createToolDto: CreateToolDto,
    user: User
    //role: UserRole,
  ): Promise<Tool> {
    const { title, description, tags } = createToolDto;

    const tool = this.create({owner: user});
    tool.title = title;
    tool.description = description;
    tool.tags = tags;
    try {
      await tool.save();
      return tool;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar a ferramenta no banco de dados' + error,
      );
    }
  }

  async FindToolsByTag(tag: string): Promise<Tool[]> {
    const findTool = await this.find();

    console.log(tag)

    const tagFilter = findTool.filter(tool => {
      return tool.tags.includes(tag);
    });

    return tagFilter;
  }
}
