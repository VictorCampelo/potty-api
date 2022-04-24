import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class CustomValidationPipe implements PipeTransform {
    transform(value: any, metaData: ArgumentMetadata): Promise<any>;
    private isEmpty;
    private formatErrors;
}
