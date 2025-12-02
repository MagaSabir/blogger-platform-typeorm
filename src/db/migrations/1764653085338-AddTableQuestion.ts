import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableQuestion1764653085338 implements MigrationInterface {
    name = 'AddTableQuestion1764653085338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying(500) NOT NULL, "correctAnswers" text array NOT NULL DEFAULT '{}', "published" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1a855c8b4f527c9633c4b054675" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Question"`);
    }

}
