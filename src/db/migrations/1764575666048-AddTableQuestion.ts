import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableQuestion1764575666048 implements MigrationInterface {
    name = 'AddTableQuestion1764575666048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying(500) NOT NULL, "correctAnswers" jsonb NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1a855c8b4f527c9633c4b054675" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Question"`);
    }

}
