import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1735353121100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(256) NOT NULL UNIQUE,
                password VARCHAR(256) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE users
        `);
    }

}
