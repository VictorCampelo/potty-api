import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createAdminUser(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
    updateUserTerms(): Promise<{
        result: import("typeorm").UpdateResult;
        message: string;
    }>;
    createOwnerUser(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
    getAuthUser(authUser: User): Promise<ReturnUserDto>;
    getUserMe(user: User): Promise<User>;
    findUserById(id: any): Promise<ReturnUserDto>;
    updateUser(updateUserDto: UpdateUserDto, file: any, user: User, id: string): Promise<User>;
    updateNormalUser(updateUserDto: UpdateUserDto, file: any, user: User): Promise<User>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    findUsers(query: FindUsersQueryDto): Promise<{
        found: {
            users: User[];
            total: number;
        };
        message: string;
    }>;
}
