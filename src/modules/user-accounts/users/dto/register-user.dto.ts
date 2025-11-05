export class RegisterUserDto {
  login: string;
  passwordHash: string;
  email: string;
  confirmationCode: string;
  confirmationCodeExpiration: Date;
}
