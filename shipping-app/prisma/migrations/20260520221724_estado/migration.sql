/*
  Warnings:

  - The values [EN_USO] on the enum `EstadoEntrega` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoEntrega_new" AS ENUM ('PENDIENTE', 'COORDINADA', 'ENTREGADO', 'DEVUELTO', 'CANCELADO');
ALTER TABLE "public"."Entrega" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Entrega" ALTER COLUMN "estado" TYPE "EstadoEntrega_new" USING ("estado"::text::"EstadoEntrega_new");
ALTER TABLE "HistorialEstado" ALTER COLUMN "estado" TYPE "EstadoEntrega_new" USING ("estado"::text::"EstadoEntrega_new");
ALTER TYPE "EstadoEntrega" RENAME TO "EstadoEntrega_old";
ALTER TYPE "EstadoEntrega_new" RENAME TO "EstadoEntrega";
DROP TYPE "public"."EstadoEntrega_old";
ALTER TABLE "Entrega" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;
