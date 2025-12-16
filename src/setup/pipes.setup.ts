import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  DomainException,
  Extension,
} from '../core/exceptions/domain.exceptions';
import { DomainExceptionCodes } from '../core/exceptions/domain-exception-codes';

export const errorFormatter = (errors: ValidationError[]): Extension[] => {
  const result: Extension[] = [];

  for (const error of errors) {
    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        result.push({
          field: error.property,
          message,
        });
      }
    }
    if (error.children?.length) {
      result.push(...errorFormatter(error.children));
    }
  }

  return result;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const extensions = errorFormatter(errors);

        return new DomainException({
          code: DomainExceptionCodes.ValidationError,
          message: 'Validation Error',
          extensions,
        });
      },
    }),
  );
}
