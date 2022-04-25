import { User } from 'src/users/user.entity';
export declare class Plan {
    id: string;
    name: string;
    nickname: string;
    url: string;
    code: number;
    price: number;
    users: User[];
    qtd_products: number;
}
