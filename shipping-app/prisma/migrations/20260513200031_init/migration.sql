-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'COORDINANDO', 'COORDINADA', 'ENTREGADO', 'EN_USO', 'DEVUELTO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoCoordinacion" AS ENUM ('ENTREGA', 'DEVOLUCION');

-- CreateEnum
CREATE TYPE "EstadoCoordinacion" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Entrega" (
    "idEntrega" TEXT NOT NULL,
    "idReserva" TEXT NOT NULL,
    "idVehiculo" TEXT NOT NULL,
    "idPropietario" TEXT NOT NULL,
    "idComprador" TEXT NOT NULL,
    "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("idEntrega")
);

-- CreateTable
CREATE TABLE "Coordinacion" (
    "idCoordinacion" TEXT NOT NULL,
    "idEntrega" TEXT NOT NULL,
    "tipo" "TipoCoordinacion" NOT NULL,
    "fecha" DATE NOT NULL,
    "horaInicioDisponible" TEXT NOT NULL,
    "horaFinDisponible" TEXT NOT NULL,
    "horaSeleccionada" TEXT,
    "ubicacion" TEXT NOT NULL,
    "estado" "EstadoCoordinacion" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coordinacion_pkey" PRIMARY KEY ("idCoordinacion")
);

-- CreateTable
CREATE TABLE "HistorialEstado" (
    "idHistorial" TEXT NOT NULL,
    "idEntrega" TEXT NOT NULL,
    "estado" "EstadoEntrega" NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,

    CONSTRAINT "HistorialEstado_pkey" PRIMARY KEY ("idHistorial")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_idReserva_key" ON "Entrega"("idReserva");

-- AddForeignKey
ALTER TABLE "Coordinacion" ADD CONSTRAINT "Coordinacion_idEntrega_fkey" FOREIGN KEY ("idEntrega") REFERENCES "Entrega"("idEntrega") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEstado" ADD CONSTRAINT "HistorialEstado_idEntrega_fkey" FOREIGN KEY ("idEntrega") REFERENCES "Entrega"("idEntrega") ON DELETE CASCADE ON UPDATE CASCADE;
