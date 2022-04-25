import { Repository } from 'typeorm';
import { File } from './file.entity';
interface IFile {
    name?: string;
    filename: string;
    url?: string;
    tags?: string[];
}
export declare class FileRepository extends Repository<File> {
    createFile(fileOnRequest: IFile): File;
}
export {};
