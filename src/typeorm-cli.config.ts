import { join } from "path";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [join(__dirname, "./**/*.entity.{ts,js}")],
    migrations: [join(__dirname, "./migrations/**/*.migration.{ts,js}")],
    migrationsTableName: 'migrations',
    synchronize: false,
})