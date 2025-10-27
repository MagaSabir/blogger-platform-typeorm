export class PasswordRecoveryEvent {
  constructor(
    public email: string,
    public code: string,
  ) {}
}
