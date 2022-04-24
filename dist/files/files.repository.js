"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
const typeorm_1 = require("typeorm");
const file_entity_1 = require("./file.entity");
const common_1 = require("@nestjs/common");
let FileRepository = class FileRepository extends typeorm_1.Repository {
    createFile(fileOnRequest) {
        let fileToUpload = this.create();
        fileToUpload = Object.assign(fileToUpload, fileOnRequest);
        try {
            return fileToUpload;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro ao salvar arquivo no banco de dados' + error);
        }
    }
};
FileRepository = __decorate([
    (0, typeorm_1.EntityRepository)(file_entity_1.File)
], FileRepository);
exports.FileRepository = FileRepository;
//# sourceMappingURL=files.repository.js.map