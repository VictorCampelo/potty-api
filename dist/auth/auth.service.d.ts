/// <reference types="multer" />
import { JwtService } from '@nestjs/jwt';
import { EmailsService } from 'src/emails/emails.service';
import { PlansService } from 'src/plans/plans.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from '../users/user-roles.enum';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/users.repository';
import { StoresService } from './../stores/stores.service';
import { UsersService } from './../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePlanDto } from './dto/change-plan-dto';
import { CreateUserStore } from './dto/create-user-store.dto';
import { CredentialsDto } from './dto/credentials.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly emailsService;
    private readonly storesService;
    private readonly usersService;
    private readonly plansService;
    constructor(userRepository: UserRepository, jwtService: JwtService, emailsService: EmailsService, storesService: StoresService, usersService: UsersService, plansService: PlansService);
    signUp(createUserDto: CreateUserDto, role: UserRole): Promise<User>;
    signUpOwner(createUserAndStore: CreateUserStore, storeAvatar: Express.Multer.File): Promise<{
        user: User;
        planUrl: string;
    } | User>;
    signIn(credentialsDto: CredentialsDto): Promise<{
        user: User;
        jwtToken: string;
    }>;
    confirmEmail({ tokenUrl, tokenDigits, }: {
        tokenUrl: string;
        tokenDigits: string;
    }): Promise<import("typeorm").UpdateResult>;
    sendEmailConfirmation(email: string): Promise<void>;
    sendRecoverPasswordEmail(email: string): Promise<void>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    changeUserPlan(changePlanDto: ChangePlanDto): Promise<User>;
    findByEmail(email: string): Promise<string>;
    socialsLogin(req: any, service: string): Promise<string | {
        id: any;
        email: any;
        firstName: any;
        lastName: any;
    }>;
}
