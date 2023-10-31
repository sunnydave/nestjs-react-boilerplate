import { registerAs } from "@nestjs/config";
export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST,
  post: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  schema: process.env.DATABASE_SCHEMA,
}));
