import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261004222529 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "fitment_request" ("id" text not null, "name" text not null, "email" text not null, "vehicle_year" text not null, "vehicle_make" text not null, "vehicle_model" text not null, "method" text check ("method" in ('photos', 'mail')) not null, "notes" text null, "product_handle" text null, "status" text check ("status" in ('new', 'code_sent')) not null default 'new', "discount_code" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fitment_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fitment_request_deleted_at" ON "fitment_request" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fitment_request" cascade;`);
  }

}
