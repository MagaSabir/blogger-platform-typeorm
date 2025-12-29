import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnumGameStatus1767030581117 implements MigrationInterface {
    name = 'ChangeEnumGameStatus1767030581117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Game_status_enum" RENAME TO "Game_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Game_status_enum" AS ENUM('PendingSecondPlayer', 'Active', 'Finished')`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" TYPE "public"."Game_status_enum" USING "status"::"text"::"public"."Game_status_enum"`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'PendingSecondPlayer'`);
        await queryRunner.query(`DROP TYPE "public"."Game_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Game_status_enum_old" AS ENUM('Pending', 'Active', 'Finished')`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" TYPE "public"."Game_status_enum_old" USING "status"::"text"::"public"."Game_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "public"."Game_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Game_status_enum_old" RENAME TO "Game_status_enum"`);
    }

}
