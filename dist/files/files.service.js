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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const files_repository_1 = require("./files.repository");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const s3 = new aws_sdk_1.default.S3({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
let FilesService = class FilesService {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async createFiles(files) {
        fs.access('public/uploads', (error) => {
            if (error) {
                fs.mkdirSync('public/uploads', { recursive: true });
            }
        });
        const filesToUpload = [];
        files.forEach((file) => {
            const { buffer } = file;
            const ref = `${(0, uuid_1.v4)()}.png`;
            fs.writeFile('public/uploads/' + ref, buffer, (err) => {
                if (err) {
                    throw err;
                }
            });
            const link = `http://localhost:3000/${ref}`;
            filesToUpload.push({
                name: ref,
                url: link,
                filename: file.originalname,
                fieldname: null,
            });
        });
        return this.fileRepository.save(filesToUpload);
    }
    async saveFile(file) {
        await this.fileRepository.save(file);
    }
    async saveAll(files) {
        await this.fileRepository.save(files);
    }
    async find() {
        return await this.fileRepository.find();
    }
    findOne(id) {
        return this.fileRepository.findOne(id, { relations: ['product'] });
    }
    update(id, _updateFileDto) {
        return `This action updates a #${id} file`;
    }
    async remove(ids, files) {
        let filesToDelete = files;
        if (!files) {
            filesToDelete = await this.fileRepository.findByIds(ids);
        }
        if (filesToDelete.length) {
            await this.fileRepository.delete(ids);
            try {
                await s3
                    .deleteObjects({
                    Bucket: process.env.AWS_BUCKET,
                    Delete: {
                        Objects: filesToDelete.map((file) => ({ Key: file.filename })),
                    },
                })
                    .promise();
            }
            catch (error) {
                throw new common_1.HttpException(`Erro ao deletar arquivos na S3: ${error}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async uploadSingleFileToS3(file, folderName) {
        const extension = path_1.default.extname(file.originalname);
        const fileName = `${folderName}/${new Date().getTime()}${extension}`.replace(/\s/g, '');
        try {
            await s3
                .putObject({
                Bucket: process.env.AWS_BUCKET,
                Key: fileName,
                Body: file.buffer,
            })
                .promise();
            return this.fileRepository.createFile({
                name: file.originalname,
                url: `${process.env.S3_URL}${fileName}`,
                filename: fileName,
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException(`Erro ao fazer upload na S3: ${error}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadMultipleFilesToS3(files, folderName) {
        const images = [];
        for (const file of files) {
            const image = await this.uploadSingleFileToS3(file, folderName);
            images.push(image);
        }
        await this.saveAll(images);
        return images;
    }
};
FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(files_repository_1.FileRepository)),
    __metadata("design:paramtypes", [files_repository_1.FileRepository])
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map