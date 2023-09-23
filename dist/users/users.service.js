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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_repository_1 = require("./users.repository");
const user_entity_1 = require("./user.entity");
const user_roles_enum_1 = require("./user-roles.enum");
const fileStorage_provider_1 = require("../files/providers/fileStorage.provider");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(userRepository, filesService) {
        this.userRepository = userRepository;
        this.filesService = filesService;
    }
    async createAdminUser(createUserDto) {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('Passwords dont match');
        }
        else {
            return this.userRepository.createUser(createUserDto, user_roles_enum_1.UserRole.ADMIN);
        }
    }
    async createOwnerUser(createUserDto, fromEduzz = false) {
        const existentEmailUser = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('Passwords dont match');
        }
        else if (existentEmailUser) {
            throw new common_1.HttpException('E-mail de usuário já está em uso', common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return this.userRepository.createUser(createUserDto, user_roles_enum_1.UserRole.OWNER, fromEduzz);
        }
    }
    async findUserById(userId) {
        const user = await this.userRepository.findOne(userId, {
            select: [
                'email',
                'firstName',
                'lastName',
                'role',
                'id',
                'street',
                'addressNumber',
                'neighborhood',
                'complement',
                'city',
                'uf',
                'zipcode',
                'logradouro',
                'storeId',
            ],
            relations: ['files', 'plan', 'profileImage'],
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async findUserMe(userId) {
        const user = await this.userRepository
            .createQueryBuilder()
            .where('User.id = :id', { id: userId })
            .select([
            'User.email',
            'User.firstName',
            'User.lastName',
            'User.role',
            'User.id',
            'User.zipcode',
            'User.street',
            'User.addressNumber',
            'User.neighborhood',
            'User.complement',
            'User.city',
            'User.uf',
            'User.logradouro',
        ])
            .leftJoinAndSelect('User.files', 'files')
            .leftJoinAndSelect('User.store', 'store')
            .leftJoinAndSelect('store.avatar', 'avatar')
            .leftJoinAndSelect('store.background', 'background')
            .leftJoinAndSelect('store.paymentMethods', 'paymentMethods')
            .leftJoinAndSelect('User.profileImage', 'profileImage')
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async myStore(userId) {
        const user = await this.userRepository.findOne(userId, {
            relations: ['store'],
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user.store;
    }
    async updateUser(updateUserRequestDto) {
        let file;
        let user = await this.findUserById(updateUserRequestDto.id);
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        user = Object.assign(user, updateUserRequestDto.updateUserDto);
        if (updateUserRequestDto.file && user) {
            file = await this.filesService.saveFiles([updateUserRequestDto.file]);
            user.profileImage = file;
        }
        return this.userRepository.save(user);
    }
    async addUserPic(user, newProfileImage) {
        const file = await this.filesService.saveFiles([newProfileImage]);
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        user.profileImage = file[0];
        return this.userRepository.save(user);
    }
    async deleteUserPic(userFileId) {
        return this.filesService.removeFiles([userFileId]);
    }
    async updateUserPic(user, newProfileImage) {
        await this.filesService.removeFiles([user.profileImage.id]);
        const file = await this.filesService.saveFiles([newProfileImage]);
        user.profileImage = file[0];
        return this.userRepository.save(user);
    }
    async deleteUser(userId) {
        const result = await this.userRepository.delete({ id: userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('User not found');
        }
        return result;
    }
    async findUsers(queryDto) {
        return this.userRepository.findUsers(queryDto);
    }
    async updateUserTerms() {
        return (0, typeorm_2.getConnection)()
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set({ hasAcceptedTerms: false })
            .where('role != :role', { role: 'ADMIN' })
            .execute();
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UserRepository)),
    __metadata("design:paramtypes", [users_repository_1.UserRepository,
        fileStorage_provider_1.FileStorageProvider])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map