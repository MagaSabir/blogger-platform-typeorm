import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableGame1765645286673 implements MigrationInterface {
    name = 'AddTableGame1765645286673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Answers_status_enum" AS ENUM('Correct', 'Incorrect')`);
        await queryRunner.query(`CREATE TABLE "Answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."Answers_status_enum" NOT NULL, "playerId" uuid NOT NULL, "questionId" uuid NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9ce77a9a6326d042fc833d63f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Sessions" ("id" SERIAL NOT NULL, "deviceId" uuid NOT NULL, "ip" character varying(30) NOT NULL, "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userAgent" character varying(200) NOT NULL, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "PK_0ff5532d98863bc618809d2d401" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying COLLATE "C" NOT NULL, "email" character varying COLLATE "C" NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isConfirmed" boolean NOT NULL DEFAULT false, "confirmationCode" character varying, "confirmationCodeExpiration" TIMESTAMP WITH TIME ZONE, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e9c863e7164d7b5d2cad97c2ed3" UNIQUE ("login", "email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "gameId" uuid NOT NULL, "score" integer NOT NULL DEFAULT '0', "position" integer NOT NULL, CONSTRAINT "PK_c390d9968607986a5f038e3305e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Game_status_enum" AS ENUM('Pending', 'Active', 'Finished')`);
        await queryRunner.query(`CREATE TABLE "Game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."Game_status_enum" NOT NULL DEFAULT 'Pending', "pairCreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "startGameDate" TIMESTAMP, "finishGameDate" TIMESTAMP, CONSTRAINT "PK_cce0ee17147c1830d09c19d4d56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "GameQuestion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "gameId" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_edebb5e5f6304e0b6505d614894" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "correctAnswers" text array NOT NULL, "published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1a855c8b4f527c9633c4b054675" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Blogs" ("id" SERIAL NOT NULL, "name" character varying(15) COLLATE "C" NOT NULL, "description" character varying(500) NOT NULL, "websiteUrl" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isMembership" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, CONSTRAINT "PK_007e2aca1eccf50f10c9176a71c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."PostLikes_status_enum" AS ENUM('Like', 'Dislike', 'None')`);
        await queryRunner.query(`CREATE TABLE "PostLikes" ("id" SERIAL NOT NULL, "postId" integer NOT NULL, "userId" uuid NOT NULL, "status" "public"."PostLikes_status_enum" NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f28e59e14e5f90fbd763c541751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Posts" ("id" SERIAL NOT NULL, "title" character varying(30) NOT NULL, "shortDescription" character varying(100) NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "blogId" integer NOT NULL, CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Comments" ("id" SERIAL NOT NULL, "content" character varying(301) NOT NULL, "postId" integer NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."CommentLikes_status_enum" AS ENUM('Like', 'Dislike', 'None')`);
        await queryRunner.query(`CREATE TABLE "CommentLikes" ("id" SERIAL NOT NULL, "commentId" integer NOT NULL, "userId" uuid NOT NULL, "status" "public"."CommentLikes_status_enum" NOT NULL, "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8205dae8dca7f8de8bace52dff2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_db4e49981d2b7781c1882a02385" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Sessions" ADD CONSTRAINT "FK_582c3cb0fcddddf078b33e316d3" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Player" ADD CONSTRAINT "FK_8d382155f20c03f32151b2bb003" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameQuestion" ADD CONSTRAINT "FK_0e6dc7cd831eb81c54e2bb98bbb" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "GameQuestion" ADD CONSTRAINT "FK_e62e1be2636656586ef3af4489b" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d"`);
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c"`);
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79"`);
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891"`);
        await queryRunner.query(`ALTER TABLE "GameQuestion" DROP CONSTRAINT "FK_e62e1be2636656586ef3af4489b"`);
        await queryRunner.query(`ALTER TABLE "GameQuestion" DROP CONSTRAINT "FK_0e6dc7cd831eb81c54e2bb98bbb"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_8d382155f20c03f32151b2bb003"`);
        await queryRunner.query(`ALTER TABLE "Player" DROP CONSTRAINT "FK_9be207182e9cd0809fe0d8f7302"`);
        await queryRunner.query(`ALTER TABLE "Sessions" DROP CONSTRAINT "FK_582c3cb0fcddddf078b33e316d3"`);
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66"`);
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_db4e49981d2b7781c1882a02385"`);
        await queryRunner.query(`DROP TABLE "CommentLikes"`);
        await queryRunner.query(`DROP TYPE "public"."CommentLikes_status_enum"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TABLE "PostLikes"`);
        await queryRunner.query(`DROP TYPE "public"."PostLikes_status_enum"`);
        await queryRunner.query(`DROP TABLE "Blogs"`);
        await queryRunner.query(`DROP TABLE "Question"`);
        await queryRunner.query(`DROP TABLE "GameQuestion"`);
        await queryRunner.query(`DROP TABLE "Game"`);
        await queryRunner.query(`DROP TYPE "public"."Game_status_enum"`);
        await queryRunner.query(`DROP TABLE "Player"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Sessions"`);
        await queryRunner.query(`DROP TABLE "Answers"`);
        await queryRunner.query(`DROP TYPE "public"."Answers_status_enum"`);
    }

}
