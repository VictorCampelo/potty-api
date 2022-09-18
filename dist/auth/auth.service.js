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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const emails_service_1 = require("../emails/emails.service");
const plans_service_1 = require("../plans/plans.service");
const users_repository_1 = require("../users/users.repository");
const stores_service_1 = require("./../stores/stores.service");
const users_service_1 = require("./../users/users.service");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, emailsService, storesService, usersService, plansService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailsService = emailsService;
        this.storesService = storesService;
        this.usersService = usersService;
        this.plansService = plansService;
    }
    async signUp(createUserDto, role) {
        if (createUserDto.password !== createUserDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('As senhas não conferem');
        }
        try {
            const user = await this.userRepository.createUser(createUserDto, role);
            await user.save();
            await this.emailsService.sendEmail(user.email, 'Boa de venda - Confirme seu e-mail', 'email-confirmation', {
                token: user.confirmationToken,
                tokenDigits: user.confirmationTokenDigits,
            });
            delete user.password;
            delete user.salt;
            return user;
        }
        catch (error) {
            throw new common_1.HttpException(`Ocorreu um erro ao cadastrar usuário: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signUpOwner(createUserAndStore, storeAvatar) {
        const { userDto, storeDto } = createUserAndStore;
        if (userDto.password !== userDto.passwordConfirmation) {
            throw new common_1.UnprocessableEntityException('As senhas não conferem');
        }
        try {
            if (!/^[A-Za-z0-9_-]+$/g.test(storeDto.name.replace(/ /g, '-'))) {
                throw new common_1.HttpException('Nome da Loja contém caracteres inválidos', common_1.HttpStatus.BAD_REQUEST);
            }
            storeDto['formatedName'] = storeDto.name.replace(/ /g, '-').toLowerCase();
            if (storeAvatar) {
                storeDto.avatar = storeAvatar;
            }
            const store = await this.storesService.create(storeDto);
            const user = await this.usersService.createOwnerUser(userDto);
            user.store = store;
            user.storeId = store.id;
            await store.save();
            await user.save();
            await this.emailsService.sendEmail(user.email, 'Boa de venda - Confirme seu e-mail', 'email-confirmation', {
                token: user.confirmationToken,
                tokenDigits: user.confirmationTokenDigits,
            });
            delete user.password;
            delete user.salt;
            if (userDto.chosenPlan) {
                const plan = await this.plansService.findByNickname(userDto.chosenPlan);
                return { user, planUrl: plan ? plan.url : 'Plan not found' };
            }
            return user;
        }
        catch (error) {
            if (error.detail &&
                error.detail.includes('Key (email)=(') &&
                error.detail.includes(') already exists.')) {
                error.status = 409;
                error.message = 'Email inserido já tem cadastro';
            }
            throw new common_1.HttpException(`Ocorreu um erro ao cadastrar lojista: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signIn(credentialsDto) {
        const user = await this.userRepository.checkCredentials(credentialsDto);
        if (user === null) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (!user.enabled) {
            throw new common_1.HttpException('Need e-mail activation', common_1.HttpStatus.FORBIDDEN);
        }
        const jwtPayload = {
            id: user.id,
            role: user.role,
            storeId: user.store && user.store.id ? user.store.id : null,
        };
        const jwtToken = this.jwtService.sign(jwtPayload);
        return { user, jwtToken };
    }
    async confirmEmail({ tokenUrl, tokenDigits, }) {
        if (tokenUrl) {
            const result = await this.userRepository.update({ confirmationToken: tokenUrl }, {
                confirmationToken: null,
                confirmationTokenDigits: null,
                enabled: true,
            });
            if (result.affected === 0)
                throw new common_1.NotFoundException('Token inválido');
            return result;
        }
        else {
            const result = await this.userRepository.update({ confirmationTokenDigits: tokenDigits }, {
                confirmationToken: null,
                confirmationTokenDigits: null,
                enabled: true,
            });
            if (result.affected === 0)
                throw new common_1.NotFoundException('Token inválido');
            return result;
        }
    }
    async sendEmailConfirmation(email) {
        const user = await this.userRepository.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('Não há usuário cadastrado com esse email.');
        user.confirmationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        user.confirmationTokenDigits = (Math.floor(Math.random() * 999999) + 1).toString();
        if (user.confirmationTokenDigits.length < 6) {
            user.confirmationTokenDigits =
                '0'.repeat(6 - user.confirmationTokenDigits.length) +
                    user.confirmationTokenDigits;
        }
        await user.save();
        await this.emailsService.sendEmail(user.email, 'Boa de venda - Confirme seu e-mail', 'email-confirmation', {
            token: user.confirmationToken,
            tokenDigits: user.confirmationTokenDigits,
        });
    }
    async sendRecoverPasswordEmail(email) {
        const user = await this.userRepository.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('Não há usuário cadastrado com esse email.');
        user.recoverToken = (Math.floor(Math.random() * 999999) + 1).toString();
        await user.save();
        await this.emailsService.sendEmail(user.email, 'Boa de venda - Recuperação de senha', 'recover-password', {
            token: user.recoverToken,
        });
    }
    async changePassword(id, changePasswordDto) {
        const { password, passwordConfirmation } = changePasswordDto;
        if (password != passwordConfirmation)
            throw new common_1.UnprocessableEntityException('As senhas não conferem');
        await this.userRepository.changePassword(id, password);
    }
    async resetPassword(recoverToken, changePasswordDto) {
        const user = await this.userRepository.findOne({ recoverToken }, {
            select: ['id'],
        });
        if (!user)
            throw new common_1.NotFoundException('Token inválido.');
        try {
            await this.changePassword(user.id.toString(), changePasswordDto);
        }
        catch (error) {
            throw error;
        }
    }
    async changeUserPlan(changePlanDto) {
        const user = await this.userRepository.findOne(changePlanDto.userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const plan = await this.plansService.findOne(changePlanDto.planId);
        if (!plan) {
            throw new common_1.HttpException('Plan not found', common_1.HttpStatus.NOT_FOUND);
        }
        user.plan = plan;
        return user.save();
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return 'Email available';
        }
        else {
            throw new common_1.HttpException('Email taken', common_1.HttpStatus.EXPECTATION_FAILED);
        }
    }
    async socialsLogin(req, service) {
        if (!req.user) {
            return `https://www.potty.com.br/404`;
        }
        const whereSocial = service === 'google'
            ? {
                googleId: req.user.id,
                email: req.user.email,
            }
            : {
                facebookId: req.user.id,
                email: req.user.email,
            };
        const user = await this.userRepository.findOne({
            where: whereSocial,
        });
        if (!user) {
            const sellerHasAccountButNotWithSocial = await this.userRepository.findOne({
                where: {
                    email: req.user.email,
                    role: 'OWNER',
                },
            });
            if (sellerHasAccountButNotWithSocial) {
                sellerHasAccountButNotWithSocial[service + 'Id'] = req.user.id;
                const jwtPayload = {
                    id: sellerHasAccountButNotWithSocial.id,
                    role: sellerHasAccountButNotWithSocial.role,
                    storeId: sellerHasAccountButNotWithSocial.store &&
                        sellerHasAccountButNotWithSocial.store.id
                        ? sellerHasAccountButNotWithSocial.store.id
                        : null,
                };
                const jwtToken = this.jwtService.sign(jwtPayload);
                return `https://www.potty.com.br/login?accessToken=${jwtToken}`;
            }
            return {
                id: req.user.id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };
        }
        else {
            const jwtPayload = {
                id: user.id,
                role: user.role,
                storeId: user.store && user.store.id ? user.store.id : null,
            };
            const jwtToken = this.jwtService.sign(jwtPayload);
            return `https://www.potty.com.br/login?accessToken=${jwtToken}`;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UserRepository)),
    __metadata("design:paramtypes", [users_repository_1.UserRepository,
        jwt_1.JwtService,
        emails_service_1.EmailsService,
        stores_service_1.StoresService,
        users_service_1.UsersService,
        plans_service_1.PlansService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map