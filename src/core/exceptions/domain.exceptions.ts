import { DomainExceptionCodes } from './domain-exception-codes';

export class Extension {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

export class DomainException extends Error {
  code: DomainExceptionCodes;
  extensions: Extension[];

  constructor(props: {
    code: DomainExceptionCodes;
    message: string;
    extensions?: Extension[];
  }) {
    super(props.message);
    this.code = props.code;
    this.extensions = props.extensions || [];
  }
}
