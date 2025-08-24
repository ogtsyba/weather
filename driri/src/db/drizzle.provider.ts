import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../users/users.schema';
import { Provider } from '@nestjs/common';

export const DRIZZLE_CLIENT = 'DRIZZLE_CLIENT';

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_CLIENT,
  useFactory() {
    // ASSUMPTION: Standard PostgreSQL environment variables are set.
    const config = {
      connectionString: process.env.DATABASE_URL as string,
    };
    const pool = new Pool(config);
    return drizzle(pool, { schema });
  },
  exports: [DRIZZLE_CLIENT],
};
