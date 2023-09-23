"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const files_repository_1 = require("../files.repository");
let LocalFileService = class LocalFileService {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.uploadFolder = 'public/uploads';
        if (!fs.existsSync(this.uploadFolder)) {
            fs.mkdirSync(this.uploadFolder, { recursive: true });
        }
    }
    async createFiles(files, folderName) {
        const filesToUpload = [];
        try {
            for (const file of files) {
                const { buffer } = file;
                const ref = `${(0, uuid_1.v4)()}.png`;
                const filePath = path.join(this.uploadFolder, ref);
                fs.writeFileSync(filePath, buffer);
                const link = `http://localhost:3001/${ref}`;
                filesToUpload.push({
                    name: ref,
                    url: link,
                    filename: file.originalname,
                    fieldname: null,
                });
            }
            const savedFiles = await this.fileRepository.save(filesToUpload);
            return savedFiles;
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Failed to save files locally', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateFile(fileId, updatedFile) {
        try {
            const existingFile = await this.fileRepository.findOne(fileId);
            if (!existingFile) {
                throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
            }
            const filePath = path.join(this.uploadFolder, existingFile.name);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            Object.assign(existingFile, updatedFile);
            const updatedFileEntity = await this.fileRepository.save(existingFile);
            return updatedFileEntity;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to update file', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFiles(fileIds) {
        try {
            for (const fileId of fileIds) {
                const file = await this.fileRepository.findOne(fileId);
                if (file) {
                    const filePath = path.join(this.uploadFolder, file.name);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    await this.fileRepository.delete(fileId);
                }
            }
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete files locally', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
LocalFileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(files_repository_1.FileRepository)),
    __metadata("design:paramtypes", [files_repository_1.FileRepository])
], LocalFileService);
exports.LocalFileService = LocalFileService;
//# sourceMappingURL=localFile.service.js.map