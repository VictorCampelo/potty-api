import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParametersDto } from '../../shared/dto/base-query-parameters.dto';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  enabled?: boolean;

  @ApiProperty()
  role?: string;
}
