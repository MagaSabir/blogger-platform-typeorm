import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerSetup: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 10000, // 10 sec
      limit: 5, // 5 requests
    },
  ],
};
