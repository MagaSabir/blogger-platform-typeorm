import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import process from 'node:process';
import * as path from 'node:path';

config({
  path: path.resolve(__dirname, '../env/.env.development.local'),
});
console.log(path.resolve(__dirname, './migrations'));

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [path.resolve(__dirname, './migrations/*.ts')],
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: false,
});
