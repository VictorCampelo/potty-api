import { ScheduleProperties } from './../types/scheduleProperties.interface';
export class CreateStoreDto {
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
  shedules = defaultSchedules;
}

const defaultSchedules: ScheduleProperties = {
  seg: ['06:00', '20:00'],
  ter: ['06:00', '20:00'],
  qua: ['06:00', '20:00'],
  qui: ['06:00', '20:00'],
  sex: ['06:00', '20:00'],
  sab: ['07:00', '12:00'],
  dom: ['07:00', '12:00'],
};
