import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolRepository } from './tool.repository';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToolRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ToolsService],
  controllers: [ToolsController],
})
export class ToolsModule {}
