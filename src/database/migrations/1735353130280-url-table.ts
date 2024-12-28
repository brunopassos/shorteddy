import { MigrationInterface, QueryRunner } from "typeorm";

export class UrlTable1735353130280 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
        await queryRunner.query(`
            CREATE TABLE urls (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                original_url VARCHAR(2048) NOT NULL,
                shortened_url_id VARCHAR(256) NOT NULL UNIQUE,
                click_count INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                deleted_at TIMESTAMP WITH TIME ZONE,
                user_id UUID,
                domain VARCHAR(256)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE urls
        `);
    }

}
