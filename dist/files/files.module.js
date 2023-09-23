"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const files_repository_1 = require("./files.repository");
const files_service_1 = require("./files.service");
const fileStorage_provider_1 = require("./providers/fileStorage.provider");
const localFile_service_1 = require("./services/localFile.service");
const s3File_service_1 = require("./services/s3File.service");
let FilesModule = class FilesModule {
};
FilesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([files_repository_1.FileRepository]),
        ],
        providers: [
            files_service_1.FilesService,
            localFile_service_1.LocalFileService,
            s3File_service_1.S3FileService,
            fileStorage_provider_1.FileStorageProvider,
        ],
        exports: [files_service_1.FilesService, fileStorage_provider_1.FileStorageProvider],
    })
], FilesModule);
exports.FilesModule = FilesModule;
//# sourceMappingURL=files.module.js.map