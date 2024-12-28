import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.provider';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                entities: [
                    __dirname + '/../users/entities/*.{ts,js}',
                    __dirname + '/../urls/entities/*.{ts,js}',
                ],
                migrations: [__dirname + '/migrations/*.ts'],
                synchronize: false,
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}