import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFieldsQuestion1765823386620 implements MigrationInterface {
    name = 'AddedFieldsQuestion1765823386620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Question" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Question" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Question" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Question" DROP COLUMN "createdAt"`);
    }

}
