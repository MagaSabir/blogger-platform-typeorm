import { Request } from 'express';
import { TokenPayloadType } from '../../modules/user-accounts/types/token-payload-type';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
  payload?: TokenPayloadType;
  cookies: {
    refreshToken: string;
  };
}
