import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1675186449770 implements MigrationInterface {
  name = 'initial1675186449770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying, "email" character varying NOT NULL, "hash" character varying NOT NULL, "description" character varying(300) NOT NULL, "youtube" character varying, "github" character varying, "twitter" character varying, "instagram" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "karya" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "tags" text, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_0132e426a8e7b17c9ba60891a6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "karya" ADD CONSTRAINT "FK_0437a15f00ba374f0ec390a34b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "karya" DROP CONSTRAINT "FK_0437a15f00ba374f0ec390a34b3"`,
    );
    await queryRunner.query(`DROP TABLE "karya"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
