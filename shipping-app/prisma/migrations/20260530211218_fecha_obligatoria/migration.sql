/*
  Warnings:

  - Made the column `fecha` on table `Coordinacion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Coordinacion" ALTER COLUMN "fecha" SET NOT NULL;
