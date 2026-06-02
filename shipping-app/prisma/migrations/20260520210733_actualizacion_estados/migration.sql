/*
  Warnings:

  - The values [COMPLETADA] on the enum `EstadoCoordinacion` will be removed. If these variants are still used in the database, this will fail.
  - The values [COORDINANDO] on the enum `EstadoEntrega` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoCoordinacion_new" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');
ALTER TABLE "public"."Coordinacion" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Coordinacion" ALTER COLUMN "estado" TYPE "EstadoCoordinacion_new" USING ("estado"::text::"EstadoCoordinacion_new");
ALTER TYPE "EstadoCoordinacion" RENAME TO "EstadoCoordinacion_old";
ALTER TYPE "EstadoCoordinacion_new" RENAME TO "EstadoCoordinacion";
DROP TYPE "public"."EstadoCoordinacion_old";
ALTER TABLE "Coordinacion" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoEntrega_new" AS ENUM ('PENDIENTE', 'COORDINADA', 'ENTREGADO', 'EN_USO', 'DEVUELTO', 'CANCELADO');
ALTER TABLE "public"."Entrega" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Entrega" ALTER COLUMN "estado" TYPE "EstadoEntrega_new" USING ("estado"::text::"EstadoEntrega_new");
ALTER TABLE "HistorialEstado" ALTER COLUMN "estado" TYPE "EstadoEntrega_new" USING ("estado"::text::"EstadoEntrega_new");
ALTER TYPE "EstadoEntrega" RENAME TO "EstadoEntrega_old";
ALTER TYPE "EstadoEntrega_new" RENAME TO "EstadoEntrega";
DROP TYPE "public"."EstadoEntrega_old";
ALTER TABLE "Entrega" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;
