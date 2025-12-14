// import { ConfigModule } from '@nestjs/config';
// import * as process from 'node:process';
// import { join } from 'path';
//
// export const configModule = ConfigModule.forRoot({
//   envFilePath: [
//     process.env.ENV_FILE_PATH?.trim() || '',
//     join(__dirname, `env`, `.env.${process.env.NODE_ENV}.local`),
//     join(__dirname, `env`, `.env.${process.env.NODE_ENV}`),
//     join(__dirname, `env`, '..env.testing'),
//     join(__dirname, `env`, '.env.production'),
//   ],
//   isGlobal: true,
// });
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import process from 'node:process';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [
    join(process.cwd(), 'src', 'env', `.env.${process.env.NODE_ENV}.local`),
    join(process.cwd(), 'src', 'env', `.env.${process.env.NODE_ENV}`),
    join(process.cwd(), 'src', 'env', '..env.testing'),
    join(process.cwd(), 'src', 'env', '.env.production'),
  ],
});
