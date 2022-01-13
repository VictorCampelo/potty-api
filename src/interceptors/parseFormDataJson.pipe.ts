import { deepParseJson } from 'deep-parse-json';
import * as _ from 'lodash';

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

type TParseFormDataJsonOptions = {
  except?: string[];
};

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) {}

  async transform(value: any, _metaData: ArgumentMetadata) {
    const { except } = this.options;
    const serializedValue = value;
    const originProperties = {};
    if (except?.length) {
      _.merge(originProperties, _.pick(serializedValue, ...except));
    }
    const deserializedValue = deepParseJson(value);

    const parsedValues = {
      ...deserializedValue,
      ...originProperties,
    };

    if (this.isEmpty(parsedValues)) {
      throw new HttpException(
        `Validation failed: No payload provided`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return parsedValues;
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }

  private formatErrors(errors: any[]) {
    return errors
      ?.map((error) => {
        return Object.values(error.constraints);
      })
      .join(', ');
  }
}
