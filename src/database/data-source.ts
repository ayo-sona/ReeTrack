import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({
  path: join(process.cwd(), '.env.local'),
});

const __dirname = join(process.cwd(), 'src', 'database');
console.log(__dirname);

// Create and export the DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_POOLER,
  entities: [join(__dirname, 'entities', '*.entity.{js,ts}')],
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: {
    rejectUnauthorized: false,
  },
});

export default AppDataSource;

// npx typeorm-ts-node-esm migration:run -d src/database/data-source.ts
// package.json script: "type": "module"
