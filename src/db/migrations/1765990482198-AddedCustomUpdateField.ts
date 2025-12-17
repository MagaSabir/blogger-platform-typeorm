import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCustomUpdateField1765990482198 implements MigrationInterface {
    name = 'AddedCustomUpdateField1765990482198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Question" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Question" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
    }

}
