/// <reference types="multer" />
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserStore } from './dto/create-user-store.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { ChangePlanDto } from './dto/change-plan-dto';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    createUserAndStore(storeAvatar: Express.Multer.File, createUserAndStore: CreateUserStore): Promise<{
        user: User | {
            user: User;
            planUrl: string;
        };
        message: string;
    }>;
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    signIn(credentiaslsDto: CredentialsDto): Promise<{
        jwtToken: string;
    }>;
    confirmEmail(activateEmailQuery: {
        tokenUrl: string;
        tokenDigits: string;
    }): Promise<{
        message: string;
    }>;
    sendEmailConfirmation(email: string): Promise<{
        message: string;
    }>;
    sendRecoverPasswordEmail(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto, user: User): Promise<{
        message: string;
    }>;
    getMe(user: User): User;
    checkEmail(emailDto: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    changeUserPlan(changePlanDto: ChangePlanDto): Promise<User>;
    facebookAuth(): Promise<any>;
    googleAuth(_req: any): Promise<void>;
    facebookRedirect(req: any, res: Response): Promise<any>;
    googleRedirect(req: any, res: Response): Promise<void>;
}
