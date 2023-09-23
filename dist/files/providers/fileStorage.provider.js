"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const localFile_service_1 = require("./../services/localFile.service");
const s3File_service_1 = require("./../services/s3File.service");
let FileStorageProvider = class FileStorageProvider {
    constructor(localFileService, s3FileService) {
        this.localFileService = localFileService;
        this.s3FileService = s3FileService;
        this.uploadFolder = 'public/uploads';
    }
    async saveFiles(files, folderName) {
        const useS3 = process.env.STORAGE_PROVIDER === 'S3';
        if (useS3) {
            return this.s3FileService.uploadMultipleFilesToS3(files, folderName || this.uploadFolder);
        }
        else {
            return this.localFileService.createFiles(files, folderName || this.uploadFolder);
        }
    }
    async removeFiles(ids) {
        const useS3 = process.env.USE_S3 === 'true';
        if (useS3) {
            return this.s3FileService.remove(ids);
        }
        else {
            return this.localFileService.deleteFiles(ids);
        }
    }
    async updateFile(id, file, folderName) {
        const useS3 = process.env.STORAGE_PROVIDER === 'S3';
        if (useS3) {
            return this.s3FileService.uploadSingleFileToS3(file, folderName);
        }
        else {
            return this.localFileService.updateFile(id, file);
        }
    }
};
FileStorageProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [localFile_service_1.LocalFileService,
        s3File_service_1.S3FileService])
], FileStorageProvider);
exports.FileStorageProvider = FileStorageProvider;
//# sourceMappingURL=fileStorage.provider.js.map