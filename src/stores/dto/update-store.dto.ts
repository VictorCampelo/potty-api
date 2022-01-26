import { ScheduleProperties } from '../types/scheduleProperties.interface';

export class UpdateStoreDto {
  name: string;
  formatedName?: string;
  CNPJ: string;
  phone: string;
  addressNumber: number;
  zipcode: string;
  city: string;
  state: string;
  description: string;
  facebookLink?: string;
  instagramLink?: string;
  whatsappLink?: string;
  shedules: ScheduleProperties;
  deliveryFee?: number;
  categoriesIds?: string[];
  avatar: Express.Multer.File;
  background: Express.Multer.File;
}
