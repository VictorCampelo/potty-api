import { PartialType } from '@nestjs/mapped-types';
import { File } from 'src/files/file.entity';
import { ScheduleProperties } from '../types/scheduleProperties.interface';
import { CreateStoreDto } from './create-store.dto';
import AWS from 'aws-sdk';
import { IsOptional } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  name?: string;
  CNPJ?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  description?: string;
  facebookLink?: string;
  instagramLink?: string;
  whatsappLink?: string;
  shedules?: ScheduleProperties;

  @IsOptional()
  avatar?: Express.Multer.File;

  background?: File;
  categoriesIds?: string[];
}
