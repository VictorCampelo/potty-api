/// <reference types="multer" />
import { FileRepository } from '../files.repository';
import { File as FileEntity } from '../file.entity';
export declare class LocalFileService {
    private readonly fileRepository;
    private readonly uploadFolder;
    constructor(fileRepository: FileRepository);
    createFiles(files: Express.Multer.File[], folderName: string): Promise<FileEntity[]>;
    updateFile(fileId: string, updatedFile: Partial<FileEntity>): Promise<FileEntity>;
    deleteFiles(fileIds: string[]): Promise<void>;
}
