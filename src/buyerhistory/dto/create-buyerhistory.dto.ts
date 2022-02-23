import { User } from 'src/users/user.entity';

export class CreateBuyerhistoryDto {
  accountStatus: string;
  paymentMethod: string;
  user: User;
}
