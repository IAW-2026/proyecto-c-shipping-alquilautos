/*
  Warnings:

  - Changed the type of `fecha` on the `Coordinacion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Coordinacion" DROP COLUMN "fecha",
ADD COLUMN     "fecha" DATE NOT NULL;
