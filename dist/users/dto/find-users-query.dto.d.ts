import { BaseQueryParametersDto } from '../../shared/dto/base-query-parameters.dto';
export declare class FindUsersQueryDto extends BaseQueryParametersDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    enabled?: boolean;
    role?: string;
}
