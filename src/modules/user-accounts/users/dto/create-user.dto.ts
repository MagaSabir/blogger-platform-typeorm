export class CreateUserDto {
  id: number;
  login: string;
  passwordHash: string;
  email: string;
  isConfirmed: boolean;
  confirmationCode: string;
  confirmationCodeExpiration: Date;
}
