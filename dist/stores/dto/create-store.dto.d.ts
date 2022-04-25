/// <reference types="multer" />
import { ScheduleProperties } from './../types/scheduleProperties.interface';
export declare class CreateStoreDto {
    name: string;
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
    shedules?: ScheduleProperties;
    deliveryFee?: number;
    avatar?: Express.Multer.File;
}
export declare const defaultSchedules: ScheduleProperties;
