import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnGameID1767005579263 implements MigrationInterface {
    name = 'DeleteColumnGameID1767005579263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" ALTER COLUMN "gameId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" ALTER COLUMN "gameId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
