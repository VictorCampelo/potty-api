/// <reference types="multer" />
import { UserRole } from '../user-roles.enum';
export declare class UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: boolean;
    zipcode?: string;
    street?: string;
    addressNumber?: number;
    neighborhood?: string;
    complement?: string;
    city?: string;
    uf?: string;
    logradouro?: string;
    profileImage: Express.Multer.File;
}
