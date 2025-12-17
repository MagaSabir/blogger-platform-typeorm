import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFieldsQuestion1765990005830 implements MigrationInterface {
    name = 'AddedFieldsQuestion1765990005830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Question" ALTER COLUMN "updatedAt" SET NOT NULL`);
    }

}
