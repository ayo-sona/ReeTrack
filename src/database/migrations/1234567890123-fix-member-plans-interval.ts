import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMemberPlansInterval1650000000000 implements MigrationInterface {
  name = 'fixMemberPlansInterval1650000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add the column as nullable
    await queryRunner.query(
      `ALTER TABLE "member_plans" ADD "interval" "public"."member_plans_interval_enum"`,
    );

    // Set a default value for existing rows (e.g., 'monthly')
    await queryRunner.query(
      `UPDATE "member_plans" SET "interval" = 'monthly' WHERE "interval" IS NULL`,
    );

    // Now alter the column to be NOT NULL
    await queryRunner.query(
      `ALTER TABLE "member_plans" ALTER COLUMN "interval" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member_plans" DROP COLUMN "interval"`,
    );
  }
}
