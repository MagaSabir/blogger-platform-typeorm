export type CreateUserType = {
  login: string;
  email: string;
  passwordHash: string;
  isConfirmed?: boolean;
  confirmationCode?: string;
};
