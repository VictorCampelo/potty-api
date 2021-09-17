import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';

export class CreateStoreDto extends CreateUserDto {
  user: User;
  business_name: string;
  CNPJ: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string;
  facebook_link?: string;
  instagram_link?: string;
  whatsapp_link?: string;
}
