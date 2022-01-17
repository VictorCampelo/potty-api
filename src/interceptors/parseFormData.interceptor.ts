import { HttpException, HttpStatus } from '@nestjs/common';
import { deepParseJson } from 'deep-parse-json';
import { Request, Response, NextFunction } from 'express';

import * as path from 'path';

import * as fs from 'fs';

import multiparty from 'multiparty';

import * as _ from 'lodash';
function isEmpty(value: any) {
  if (Object.keys(value).length < 1) {
    return true;
  }
  return false;
}

interface ParseFormDataJsonProps {
  except?: string[];
  hasMultiFile?: boolean;
}

const convertObjectArrayValuesToObject = (object: { [key: string]: any }) => {
  const result = {};

  Object.keys(object).forEach((objectKey) => {
    const fieldValue = object[objectKey];

    if (Array.isArray(fieldValue) && fieldValue.length === 1) {
      fieldValue.forEach((value) => {
        if (value) {
          result[objectKey] = value;
        }
      });
    } else {
      result[objectKey] = fieldValue;
    }
  });

  return result;
};

const formatFiles = (files: { [key: string]: any }) => {
  const result = {};

  Object.keys(files).map((fileKey) => {
    const file = files[fileKey];

    const extension = path.extname(file.originalFilename);

    if (/\/(jpg|jpeg|png|gif|svg|mpeg)$/.test(extension)) {
      throw new HttpException(
        `Unsupported file type ${extension}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = fs.readFileSync(file.path);

    // use this because of multer
    file.originalname = file.originalFilename;
    delete file.originalFilename;

    result[fileKey] = {
      buffer,
      ...file,
    };
  });

  return result;
};

export const parseFormDataJsonInterceptor = ({
  except,
  hasMultiFile = false,
}: ParseFormDataJsonProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const form = new multiparty.Form({ autoFiles: true });

    const serializedValue = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        try {
          const formattedFiles = formatFiles(
            convertObjectArrayValuesToObject(files),
          );

          const result = {
            ...convertObjectArrayValuesToObject(fields),
            ...formattedFiles,
          };

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

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

    res.locals = parsedValues;

    return next();
  };
};
