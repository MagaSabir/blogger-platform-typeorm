import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFinishedAtField1766681635401 implements MigrationInterface {
    name = 'AddedFinishedAtField1766681635401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" ADD "finishedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP COLUMN "finishedAt"`);
    }

}
