import { BaseQueryParametersDto } from "src/shared/dto/base-query-parameters.dto";
export declare class findOrdersDto extends BaseQueryParametersDto {
    start?: Date;
    end?: Date;
    confirmed?: boolean;
}
