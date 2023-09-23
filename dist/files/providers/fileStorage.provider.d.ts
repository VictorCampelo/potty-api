/// <reference types="multer" />
import { LocalFileService } from './../services/localFile.service';
import { S3FileService } from './../services/s3File.service';
import { File as FileEntity } from './../file.entity';
export declare class FileStorageProvider {
    private readonly localFileService;
    private readonly s3FileService;
    private readonly uploadFolder;
    constructor(localFileService: LocalFileService, s3FileService: S3FileService);
    saveFiles(files: Express.Multer.File[], folderName?: string): Promise<FileEntity[]>;
    removeFiles(ids: string[]): Promise<void>;
    updateFile(id: string, file: Express.Multer.File, folderName: string): Promise<any>;
}
