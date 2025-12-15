import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.testing'),
});

process.env.NODE_ENV = 'testing';
