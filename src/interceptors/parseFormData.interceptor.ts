import { HttpException, HttpStatus } from '@nestjs/common';
import { deepParseJson } from 'deep-parse-json';
import { Request, Response, NextFunction } from 'express';

import * as _ from 'lodash';

function isEmpty(value: any) {
  if (Object.keys(value).length < 1) {
    return true;
  }
  return false;
}

interface ParseFormDataJsonProps {
  except?: string[];
}

export const parseFormDataJsonInterceptor = ({
  except,
}: ParseFormDataJsonProps) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const serializedValue = req.body;

    const originProperties = {};
    if (except?.length) {
      _.merge(originProperties, _.pick(serializedValue, ...except));
    }
    const deserializedValue = deepParseJson(serializedValue);

    const parsedValues = {
      ...deserializedValue,
      ...originProperties,
    };

    if (isEmpty(parsedValues)) {
      throw new HttpException(
        `Validation failed: No payload provided`,
        HttpStatus.BAD_REQUEST,
      );
    }

    req.body = parsedValues;

    return next();
  };
};
