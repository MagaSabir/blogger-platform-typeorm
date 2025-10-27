import { DomainExceptionCodes } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

export class DomainException extends Error {
  message: string;
  code: DomainExceptionCodes;
  extensions: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCodes;
    message: string;
    extensions?: Extension[];
  }) {
    super(errorInfo.message);
    this.message = errorInfo.message;
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions || [];
  }
}
