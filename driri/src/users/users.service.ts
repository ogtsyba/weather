import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_CLIENT } from '../db/drizzle.provider';
import * as schema from './users.schema';
import { InsertUser, SelectUser } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(userData: InsertUser): Promise<SelectUser> {
    const [newUser] = await this.db
      .insert(schema.users)
      .values(userData)
      .returning();
    return newUser;
  }
}
