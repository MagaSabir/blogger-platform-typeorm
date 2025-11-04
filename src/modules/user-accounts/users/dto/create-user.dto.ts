export class CreateUserDto {
  login: string;
  passwordHash: string;
  email: string;
  isConfirmed: boolean;
  confirmationCode: string;
  confirmationCodeExpiration: Date;
}
