export class CreateUserType {
  id: number;
  login: string;
  password: string;
  email: string;
  isConfirmed: boolean;
  confirmationCode: string;
  confirmationCodeExpiration: Date;
}
