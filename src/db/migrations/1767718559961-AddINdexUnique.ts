import { MigrationInterface, QueryRunner } from "typeorm";

export class AddINdexUnique1767718559961 implements MigrationInterface {
    name = 'AddINdexUnique1767718559961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_db4e49981d2b7781c1882a02385"`);
        await queryRunner.query(`ALTER TABLE "Answers" ALTER COLUMN "playerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" ALTER COLUMN "gameId" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_edb2ca78fde4f0b69f4543e5f1" ON "Answers" ("playerId", "questionId") `);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_db4e49981d2b7781c1882a02385" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_db4e49981d2b7781c1882a02385"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_edb2ca78fde4f0b69f4543e5f1"`);
        await queryRunner.query(`ALTER TABLE "Player" ALTER COLUMN "gameId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Answers" ALTER COLUMN "playerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_db4e49981d2b7781c1882a02385" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
