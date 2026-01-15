import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerStatsEntity1768421876361 implements MigrationInterface {
    name = 'AddPlayerStatsEntity1768421876361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Statistic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "gamesCount" integer NOT NULL DEFAULT '0', "wins" integer NOT NULL DEFAULT '0', "loses" integer NOT NULL DEFAULT '0', "draws" integer NOT NULL DEFAULT '0', "sumScore" integer NOT NULL DEFAULT '0', "avgScore" double precision NOT NULL DEFAULT '0', CONSTRAINT "UQ_d598491c5bd73e6d63202e62f70" UNIQUE ("userId"), CONSTRAINT "PK_7eea30cf65db42cb7a349dfe546" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Statistic"`);
    }

}
