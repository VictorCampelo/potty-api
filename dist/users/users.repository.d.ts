import { Repository } from 'typeorm';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
export declare class UserRepository extends Repository<User> {
    findUsers(queryDto: FindUsersQueryDto): Promise<{
        users: User[];
        total: number;
    }>;
    createUser(createUserDto: CreateUserDto, role: UserRole, fromEduzz?: boolean): Promise<User>;
    checkCredentials(credentialsDto: CredentialsDto): Promise<User>;
    changePassword(id: string, password: string): Promise<void>;
    private hashPassword;
}
