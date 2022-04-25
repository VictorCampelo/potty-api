/// <reference types="multer" />
import { UpdateUserDto } from './update-users.dto';
export declare class UpdateUserRequestDto {
    updateUserDto: UpdateUserDto;
    id: string;
    file: Express.Multer.File;
}
