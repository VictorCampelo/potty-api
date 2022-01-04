import { ScheduleProperties } from '../types/scheduleProperties.interface';

export class UpdateStoreDto {
  name: string;
  CNPJ: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string;
  facebookLink?: string;
  instagramLink?: string;
  whatsappLink?: string;
  shedules: ScheduleProperties;
  categoriesIds?: string[];
  avatar: Express.Multer.File;
  background: Express.Multer.File;
}
