import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ScheduleProperties } from './../types/scheduleProperties.interface';
export class CreateStoreDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  CNPJ: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  addressNumber: number;

  @ApiProperty()
  zipcode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  facebookLink?: string;

  @ApiProperty()
  instagramLink?: string;

  @ApiProperty()
  whatsappLink?: string;

  @ApiProperty()
  shedules?: ScheduleProperties;

  @ApiProperty()
  deliveryFee?: number;

  @ApiProperty()
  @IsOptional()
  avatar?: Express.Multer.File;
}

export const defaultSchedules: ScheduleProperties = {
  seg: ['06:00', '20:00'],
  ter: ['06:00', '20:00'],
  qua: ['06:00', '20:00'],
  qui: ['06:00', '20:00'],
  sex: ['06:00', '20:00'],
  sab: ['07:00', '12:00'],
  dom: ['07:00', '12:00'],
};
