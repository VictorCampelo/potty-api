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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async findUsers(queryDto) {
        queryDto.enabled = queryDto.enabled === undefined ? true : queryDto.enabled;
        queryDto.offset = queryDto.offset < 1 ? 1 : queryDto.offset;
        queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;
        const { email, firstName, lastName, enabled, role } = queryDto;
        const query = this.createQueryBuilder('user');
        query.where('user.enabled = :enabled', { enabled });
        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }
        if (firstName) {
            query.andWhere('user.name ILIKE :name', { name: `%${firstName}%` });
        }
        if (lastName) {
            query.andWhere('user.name ILIKE :name', { name: `%${lastName}%` });
        }
        if (role) {
            query.andWhere('user.role = :role', { role });
        }
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
        query.select(['user.name', 'user.email', 'user.role', 'user.enabled']);
        const [users, total] = await query.getManyAndCount();
        return { users, total };
    }
    async createUser(createUserDto, role, fromEduzz) {
        const { email, firstName, lastName, password, zipcode, street, addressNumber, neighborhood, complement, city, uf, logradouro, googleId, facebookId, } = createUserDto;
        const user = this.create();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.zipcode = zipcode;
        user.street = street;
        user.addressNumber = addressNumber;
        user.neighborhood = neighborhood;
        user.complement = complement;
        user.city = city;
        user.uf = uf;
        user.logradouro = logradouro;
        user.googleId = googleId;
        user.facebookId = facebookId;
        if (fromEduzz) {
            user.enabled = true;
            return user;
        }
        user.enabled = false;
        user.confirmationToken = crypto.randomBytes(32).toString('hex');
        user.confirmationTokenDigits = (Math.floor(Math.random() * 999999) + 1).toString();
        if (user.confirmationTokenDigits.length < 6) {
            user.confirmationTokenDigits =
                '0'.repeat(6 - user.confirmationTokenDigits.length) +
                    user.confirmationTokenDigits;
        }
        return user;
    }
    async checkCredentials(credentialsDto) {
        const { email, password } = credentialsDto;
        const user = await this.createQueryBuilder()
            .leftJoinAndSelect('User.store', 'store')
            .leftJoinAndSelect('store.avatar', 'avatar')
            .where('User.email = :email', { email })
            .getOne();
        if (user && (await user.checkPassword(password))) {
            return user;
        }
        else {
            return null;
        }
    }
    async changePassword(id, password) {
        const user = await this.findOne(id);
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.recoverToken = null;
        await user.save();
    }
    async hashPassword(password, salt) {
        return bcrypt.hash(password, salt);
    }
};
UserRepository = __decorate([
    (0, typeorm_1.EntityRepository)(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=users.repository.js.map