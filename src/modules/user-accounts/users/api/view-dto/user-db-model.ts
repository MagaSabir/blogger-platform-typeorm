export type UserDbModel = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isConfirmed: boolean;
  confirmationCode: string;
  confirmationCodeExpiration: Date;
};
