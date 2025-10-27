export class UserRegisteredEvent {
  constructor(
    public email: string,
    public code: string,
  ) {}
}
