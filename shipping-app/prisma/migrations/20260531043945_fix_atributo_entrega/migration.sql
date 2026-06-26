/*
  Warnings:

  - You are about to drop the column `id_comprador` on the `Entrega` table. All the data in the column will be lost.
  - Added the required column `id_alquilador` to the `Entrega` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrega" DROP COLUMN "id_comprador",
ADD COLUMN     "id_alquilador" TEXT NOT NULL;
