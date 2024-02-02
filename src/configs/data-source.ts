import "reflect-metadata";
import { DataSource, DefaultNamingStrategy } from "typeorm";
import "dotenv/config";
export class LowercaseNamingStrategy extends DefaultNamingStrategy {
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return customName || propertyName.toLowerCase();
  }
}
const basePath = process.env.NODE_ENV === "production" ? "build" : "src";
const extension = process.env.NODE_ENV === "production" ? "js" : "ts";
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  migrationsRun: false,
  // logging: true,
  logger: process.env.DB_LOGGING === "ENABLED" ? "file" : "advanced-console",
  debug: process.env.DB_LOGGING === "ENABLED",
  entities: [`${basePath}/models/*.${extension}`],
  migrations: [`${basePath}/migrations/*.ts`],
  subscribers: [`${basePath}/subscribers/*.${extension}`],
  timezone: "+05:30",
  namingStrategy: new LowercaseNamingStrategy(), //this enables lowercase table names
});

export const mongodbConfig = {
  level: "http",
  db: process.env.MONGO_DB_URL || "",
  collection: `logs`,
  metaKey: "details",
  options: {
    useUnifiedTopology: true,
  },
  // capped: true,
  // cappedSize: 50000000, //50MB
};

export const performanceMongodbConfig = {
  level: "http",
  db: process.env.MONGO_DB_URL || "",
  collection: `performanceLogs`,
  metaKey: "details",
  options: {
    useUnifiedTopology: true,
  },
  capped: true,
  cappedSize: 50000000, //50MB
};
export default AppDataSource;
