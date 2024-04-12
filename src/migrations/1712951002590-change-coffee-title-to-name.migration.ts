import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCoffeeTitleToName1712951002590 implements MigrationInterface {
    name = 'ChangeCoffeeTitleToName1712951002590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`);
    }

}
