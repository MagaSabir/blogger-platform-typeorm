import { Extension } from '../domain.exceptions';
import { DomainExceptionCodes } from '../domain-exception-codes';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCodes;
};
