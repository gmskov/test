import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1680247580902 implements MigrationInterface {
    name = 'migration1680247580902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthDate" date, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7d0c76a9be7e12cceddc2c23d0" ON "person" ("firstName", "lastName") `);
        await queryRunner.query(`CREATE TABLE "employee_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taxId" character varying(14), "address" character varying, "phone" character varying, "email" character varying, "personId" uuid NOT NULL, CONSTRAINT "REL_763ec6c7dd505deea3e82363e6" UNIQUE ("personId"), CONSTRAINT "PK_ff6fbb46f0a78351950c41a5e66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_salary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dateEffective" date NOT NULL, "baseUnit" "public"."employee_salary_baseunit_enum" NOT NULL, "rate" numeric NOT NULL, "net" boolean NOT NULL DEFAULT false, "employeeId" uuid NOT NULL, CONSTRAINT "PK_b7f7a2169fecb7b83d8e7b05dd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "data" bytea NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceDate" date NOT NULL, "amount" numeric(10,2) NOT NULL, "description" character varying NOT NULL, "note" character varying, "fileId" uuid NOT NULL, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "login" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "phone" character varying, "email" character varying, "photo" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user" ("login") `);
        await queryRunner.query(`CREATE TABLE "g_pro_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "login" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "phone" character varying, "email" character varying, "photo" character varying, "laravel_session" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_b5a063b8cba602c3c21ca02323" UNIQUE ("user_id"), CONSTRAINT "PK_7189eec5319414ac8d343f36860" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78b2333535ade497cce3a8f39e" ON "g_pro_user" ("login") `);
        await queryRunner.query(`CREATE TABLE "password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "hash" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "REL_4cd77c9b2e2522ee9d3671b3bc" UNIQUE ("user_id"), CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee_profile" ADD CONSTRAINT "FK_763ec6c7dd505deea3e82363e62" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_salary" ADD CONSTRAINT "FK_dd2cf12fb00ada7d026bdad93ac" FOREIGN KEY ("employeeId") REFERENCES "employee_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_3e2104bb9d662916cfb11fff13b" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "g_pro_user" ADD CONSTRAINT "FK_b5a063b8cba602c3c21ca023238" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_4cd77c9b2e2522ee9d3671b3bc1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_4cd77c9b2e2522ee9d3671b3bc1"`);
        await queryRunner.query(`ALTER TABLE "g_pro_user" DROP CONSTRAINT "FK_b5a063b8cba602c3c21ca023238"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_3e2104bb9d662916cfb11fff13b"`);
        await queryRunner.query(`ALTER TABLE "employee_salary" DROP CONSTRAINT "FK_dd2cf12fb00ada7d026bdad93ac"`);
        await queryRunner.query(`ALTER TABLE "employee_profile" DROP CONSTRAINT "FK_763ec6c7dd505deea3e82363e62"`);
        await queryRunner.query(`DROP TABLE "password"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78b2333535ade497cce3a8f39e"`);
        await queryRunner.query(`DROP TABLE "g_pro_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "employee_salary"`);
        await queryRunner.query(`DROP TABLE "employee_profile"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d0c76a9be7e12cceddc2c23d0"`);
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
