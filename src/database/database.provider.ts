import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || 'db',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'shorteddy-db',
    entities: [
        __dirname + '/../users/entities/*.{ts,js}',
        __dirname + '/../urls/entities/*.{ts,js}',
    ],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
});

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => AppDataSource.initialize(),
    },
];
