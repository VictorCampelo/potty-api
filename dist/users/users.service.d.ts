/// <reference types="multer" />
import { Store } from 'src/stores/store.entity';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { FilesService } from 'src/files/files.service';
export declare class UsersService {
    private userRepository;
    private filesService;
    constructor(userRepository: UserRepository, filesService: FilesService);
    createAdminUser(createUserDto: CreateUserDto): Promise<User>;
    createOwnerUser(createUserDto: CreateUserDto, fromEduzz?: boolean): Promise<User>;
    findUserById(userId: string): Promise<User>;
    findUserMe(userId: string): Promise<User>;
    myStore(userId: string): Promise<Store>;
    updateUser(updateUserRequestDto: UpdateUserRequestDto): Promise<User>;
    addUserPic(user: User, newProfileImage: Express.Multer.File): Promise<User>;
    deleteUserPic(userFileId: string): Promise<void>;
    updateUserPic(user: User, newProfileImage: Express.Multer.File): Promise<User>;
    deleteUser(userId: string): Promise<import("typeorm").DeleteResult>;
    findUsers(queryDto: FindUsersQueryDto): Promise<{
        users: User[];
        total: number;
    }>;
    updateUserTerms(): Promise<import("typeorm").UpdateResult>;
    findByEmail(email: string): Promise<User>;
}
