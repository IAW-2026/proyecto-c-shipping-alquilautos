/*
  Warnings:

  - The primary key for the `Coordinacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `horaFinDisponible` on the `Coordinacion` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicioDisponible` on the `Coordinacion` table. All the data in the column will be lost.
  - You are about to drop the column `horaSeleccionada` on the `Coordinacion` table. All the data in the column will be lost.
  - You are about to drop the column `idCoordinacion` on the `Coordinacion` table. All the data in the column will be lost.
  - You are about to drop the column `idEntrega` on the `Coordinacion` table. All the data in the column will be lost.
  - The primary key for the `Entrega` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idComprador` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `idEntrega` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `idPropietario` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `idReserva` on the `Entrega` table. All the data in the column will be lost.
  - You are about to drop the column `idVehiculo` on the `Entrega` table. All the data in the column will be lost.
  - The primary key for the `HistorialEstado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fechaHora` on the `HistorialEstado` table. All the data in the column will be lost.
  - You are about to drop the column `idEntrega` on the `HistorialEstado` table. All the data in the column will be lost.
  - You are about to drop the column `idHistorial` on the `HistorialEstado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_reserva]` on the table `Entrega` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hora_fin_disponible` to the `Coordinacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora_inicio_disponible` to the `Coordinacion` table without a default value. This is not possible if the table is not empty.
  - The required column `id_coordinacion` was added to the `Coordinacion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_entrega` to the `Coordinacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_comprador` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - The required column `id_entrega` was added to the `Entrega` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_propietario` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_reserva` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_vehiculo` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_entrega` to the `HistorialEstado` table without a default value. This is not possible if the table is not empty.
  - The required column `id_historial` was added to the `HistorialEstado` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Coordinacion" DROP CONSTRAINT "Coordinacion_idEntrega_fkey";

-- DropForeignKey
ALTER TABLE "HistorialEstado" DROP CONSTRAINT "HistorialEstado_idEntrega_fkey";

-- DropIndex
DROP INDEX "Entrega_idReserva_key";

-- AlterTable
ALTER TABLE "Coordinacion" DROP CONSTRAINT "Coordinacion_pkey",
DROP COLUMN "horaFinDisponible",
DROP COLUMN "horaInicioDisponible",
DROP COLUMN "horaSeleccionada",
DROP COLUMN "idCoordinacion",
DROP COLUMN "idEntrega",
ADD COLUMN     "hora_fin_disponible" TEXT NOT NULL,
ADD COLUMN     "hora_inicio_disponible" TEXT NOT NULL,
ADD COLUMN     "hora_seleccionada" TEXT,
ADD COLUMN     "id_coordinacion" TEXT NOT NULL,
ADD COLUMN     "id_entrega" TEXT NOT NULL,
ALTER COLUMN "fecha" SET DATA TYPE TEXT,
ADD CONSTRAINT "Coordinacion_pkey" PRIMARY KEY ("id_coordinacion");

-- AlterTable
ALTER TABLE "Entrega" DROP CONSTRAINT "Entrega_pkey",
DROP COLUMN "idComprador",
DROP COLUMN "idEntrega",
DROP COLUMN "idPropietario",
DROP COLUMN "idReserva",
DROP COLUMN "idVehiculo",
ADD COLUMN     "id_comprador" TEXT NOT NULL,
ADD COLUMN     "id_entrega" TEXT NOT NULL,
ADD COLUMN     "id_propietario" TEXT NOT NULL,
ADD COLUMN     "id_reserva" TEXT NOT NULL,
ADD COLUMN     "id_vehiculo" TEXT NOT NULL,
ADD CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id_entrega");

-- AlterTable
ALTER TABLE "HistorialEstado" DROP CONSTRAINT "HistorialEstado_pkey",
DROP COLUMN "fechaHora",
DROP COLUMN "idEntrega",
DROP COLUMN "idHistorial",
ADD COLUMN     "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_entrega" TEXT NOT NULL,
ADD COLUMN     "id_historial" TEXT NOT NULL,
ADD CONSTRAINT "HistorialEstado_pkey" PRIMARY KEY ("id_historial");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_id_reserva_key" ON "Entrega"("id_reserva");

-- AddForeignKey
ALTER TABLE "Coordinacion" ADD CONSTRAINT "Coordinacion_id_entrega_fkey" FOREIGN KEY ("id_entrega") REFERENCES "Entrega"("id_entrega") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEstado" ADD CONSTRAINT "HistorialEstado_id_entrega_fkey" FOREIGN KEY ("id_entrega") REFERENCES "Entrega"("id_entrega") ON DELETE CASCADE ON UPDATE CASCADE;
