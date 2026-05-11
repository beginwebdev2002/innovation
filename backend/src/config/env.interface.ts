export interface EnvironmentVariables {
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRED: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRED: string;
  HASH_SALT: number;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ORIGIN: string;
}
