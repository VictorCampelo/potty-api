/// <reference types="multer" />
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './files.repository';
import { File } from './file.entity';
export declare class FilesService {
    private readonly fileRepository;
    constructor(fileRepository: FileRepository);
    createFiles(files: Express.Multer.File[]): Promise<File[]>;
    saveFile(file: File): Promise<void>;
    saveAll(files: File[]): Promise<void>;
    find(): Promise<File[]>;
    findOne(id: any): Promise<File>;
    update(id: number, _updateFileDto: UpdateFileDto): string;
    remove(ids: string[], files?: File[]): Promise<void>;
    uploadSingleFileToS3(file: Express.Multer.File, folderName: string): Promise<File>;
    uploadMultipleFilesToS3(files: Express.Multer.File[], folderName: string): Promise<File[]>;
}
