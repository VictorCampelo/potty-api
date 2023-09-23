/// <reference types="multer" />
import { FileRepository } from '../files.repository';
import { File as FileEntity } from '../file.entity';
export declare class S3FileService {
    private readonly fileRepository;
    constructor(fileRepository: FileRepository);
    uploadSingleFileToS3(file: Express.Multer.File, folderName: string): Promise<FileEntity>;
    uploadMultipleFilesToS3(files: Express.Multer.File[], folderName: string): Promise<FileEntity[]>;
    saveAll(files: FileEntity[]): Promise<void>;
    saveFile(file: File): Promise<void>;
    remove(ids: string[]): Promise<void>;
}
