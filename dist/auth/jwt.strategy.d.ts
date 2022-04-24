import { UserRepository } from '../users/users.repository';
declare type Payload = {
    id: string;
    role: string;
    storeId?: string;
};
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: UserRepository);
    validate(session: Payload): Promise<false | Payload>;
}
export {};
